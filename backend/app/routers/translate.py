from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from deep_translator import GoogleTranslator
import hashlib

router = APIRouter(prefix="/api/translate", tags=["translate"])

SUPPORTED = {
    "en": "English",
    "rw": "Kinyarwanda",
    "fr": "French",
    "sw": "Swahili",
    "es": "Spanish",
    "de": "German",
    "zh-CN": "Chinese (Mandarin)",
    "ar": "Arabic",
    "pt": "Portuguese",
    "hi": "Hindi",
}

# Phonetic + usage notes for common Kinyarwanda phrases (en->rw)
RW_ENRICHMENT: dict[str, dict] = {
    "mwaramutse, mumeze mute?": {"romanization": "mwa-ra-MU-tse, mu-ME-ze MU-te", "usage_note": "The most common greeting in Rwanda — used in the morning."},
    "murakoze cyane": {"romanization": "mu-ra-KO-ze CHA-ne", "usage_note": "Adding 'cyane' intensifies the gratitude."},
    "murakoze": {"romanization": "mu-ra-KO-ze", "usage_note": "Used in both formal and informal settings."},
    "muraho": {"romanization": "mu-RA-ho", "usage_note": "General greeting used any time of day."},
    "umugoroba mwiza": {"romanization": "u-mu-go-RO-ba mwi-ZA", "usage_note": "A warm evening greeting in Rwanda."},
    "mwiriwe neza": {"romanization": "mwi-RI-we NE-za", "usage_note": "Polite evening greeting."},
    "ibitaro byegereye he?": {"romanization": "i-bi-TA-ro bye-ge-RE-ye HE", "usage_note": "Ask locals — Rwandans are always willing to help."},
    "nyamuneka vuga buhoro": {"romanization": "nya-mu-NE-ka VU-ga bu-HO-ro", "usage_note": "Repeating 'buhoro' emphasizes speaking very slowly."},
    "nitwa yohana": {"romanization": "NI-twa yo-HA-na", "usage_note": "Replace 'Yohana' with your own name."},
    "simbyumva": {"romanization": "sim-BYUM-va", "usage_note": "Useful when you need someone to repeat or clarify."},
    "yego": {"romanization": "YE-go", "usage_note": "Simple affirmative."},
    "oya": {"romanization": "O-ya", "usage_note": "Simple negative."},
    "mbabarira": {"romanization": "mba-ba-RI-ra", "usage_note": "Used for both 'sorry' and 'excuse me'."},
    "murabeho": {"romanization": "mu-ra-BE-ho", "usage_note": "A respectful farewell."},
    "bwakeye": {"romanization": "bwa-KE-ye", "usage_note": "Said when parting at night or going to sleep."},
    "nzimiye inzira": {"romanization": "nzi-MI-ye i-NZI-ra", "usage_note": "Rwandans are very friendly and will help you find your way."},
}

_cache: dict = {}

NEEDS_ROMANIZATION = {"rw", "ar", "hi"}


class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "en"
    target_lang: str = "rw"


class TranslateResponse(BaseModel):
    translated_text: str
    source_lang: str
    target_lang: str
    romanization: str | None = None
    usage_note: str | None = None


def _cache_key(text: str, src: str, tgt: str) -> str:
    return hashlib.md5(f"{src}|{tgt}|{text.strip().lower()}".encode()).hexdigest()


def _enrich(translated: str, tgt: str) -> tuple[str | None, str | None]:
    """Return (romanization, usage_note) from hardcoded dict if available."""
    if tgt == "rw":
        entry = RW_ENRICHMENT.get(translated.strip().lower())
        if entry:
            return entry.get("romanization"), entry.get("usage_note")
    return None, None


@router.post("", response_model=TranslateResponse)
def translate(req: TranslateRequest):
    if not req.text.strip():
        raise HTTPException(400, "Text cannot be empty")
    if req.source_lang not in SUPPORTED or req.target_lang not in SUPPORTED:
        raise HTTPException(400, f"Unsupported language code. Supported: {list(SUPPORTED.keys())}")
    if req.source_lang == req.target_lang:
        return TranslateResponse(translated_text=req.text, source_lang=req.source_lang, target_lang=req.target_lang)

    key = _cache_key(req.text, req.source_lang, req.target_lang)
    if key in _cache:
        return TranslateResponse(**_cache[key])

    try:
        translated = GoogleTranslator(source=req.source_lang, target=req.target_lang).translate(req.text.strip())
    except Exception as e:
        raise HTTPException(502, f"Translation failed: {str(e)}")

    romanization, usage_note = _enrich(translated, req.target_lang)

    result = {
        "translated_text": translated,
        "source_lang": req.source_lang,
        "target_lang": req.target_lang,
        "romanization": romanization,
        "usage_note": usage_note,
    }
    _cache[key] = result
    return TranslateResponse(**result)


@router.get("/languages")
def get_languages():
    return [{"code": k, "name": v} for k, v in SUPPORTED.items()]

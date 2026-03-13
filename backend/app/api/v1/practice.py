from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ...database import get_db
from ...models.practice import (
    FlashcardDeck, Flashcard, FlashcardProgress,
    VocabularyBank,
    SpeakingExercise, SpeakingAttempt,
    ListeningExercise, ListeningAttempt
)
from ...models.user import User
from ...dependencies import get_current_user, get_current_active_user

router = APIRouter(prefix="/practice", tags=["Practice"])

# ==================== FLASHCARDS ====================

@router.get("/flashcards/decks")
async def get_flashcard_decks(
    language_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's flashcard decks"""
    query = db.query(FlashcardDeck).filter(
        (FlashcardDeck.user_id == current_user.id) | (FlashcardDeck.is_system == True)
    )
    
    if language_id:
        query = query.filter(FlashcardDeck.language_id == language_id)
    
    decks = query.all()
    return {"decks": decks}

@router.get("/flashcards/decks/{deck_id}")
async def get_flashcard_deck(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get deck with flashcards"""
    deck = db.query(FlashcardDeck).filter(FlashcardDeck.id == deck_id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    
    # Get flashcards
    flashcards = db.query(Flashcard).filter(Flashcard.deck_id == deck_id).all()
    
    # Get user's progress
    flashcard_ids = [f.id for f in flashcards]
    progress = db.query(FlashcardProgress).filter(
        FlashcardProgress.user_id == current_user.id,
        FlashcardProgress.flashcard_id.in_(flashcard_ids)
    ).all()
    
    progress_dict = {p.flashcard_id: p for p in progress}
    
    return {
        "deck": deck,
        "flashcards": flashcards,
        "progress": progress_dict
    }

@router.post("/flashcards/decks")
async def create_flashcard_deck(
    name: str,
    language_id: int,
    description: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new flashcard deck"""
    deck = FlashcardDeck(
        user_id=current_user.id,
        language_id=language_id,
        name=name,
        description=description
    )
    db.add(deck)
    db.commit()
    db.refresh(deck)
    
    return {"message": "Deck created", "deck_id": deck.id}

@router.post("/flashcards/decks/{deck_id}/cards")
async def add_flashcard(
    deck_id: int,
    front_text: str,
    back_text: str,
    phonetic: Optional[str] = None,
    example_sentence: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Add a flashcard to a deck"""
    deck = db.query(FlashcardDeck).filter(FlashcardDeck.id == deck_id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    
    if deck.user_id != current_user.id and not deck.is_system:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    flashcard = Flashcard(
        deck_id=deck_id,
        front_text=front_text,
        back_text=back_text,
        phonetic=phonetic,
        example_sentence=example_sentence
    )
    db.add(flashcard)
    
    # Update card count
    deck.card_count += 1
    
    db.commit()
    db.refresh(flashcard)
    
    return {"message": "Card added", "flashcard_id": flashcard.id}

@router.post("/flashcards/{flashcard_id}/review")
async def review_flashcard(
    flashcard_id: int,
    status: str,  # new, learning, known
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Review a flashcard (update progress)"""
    progress = db.query(FlashcardProgress).filter(
        FlashcardProgress.user_id == current_user.id,
        FlashcardProgress.flashcard_id == flashcard_id
    ).first()
    
    if not progress:
        progress = FlashcardProgress(
            user_id=current_user.id,
            flashcard_id=flashcard_id,
            status=status,
            review_count=1
        )
        db.add(progress)
    else:
        progress.status = status
        progress.review_count += 1
    
    db.commit()
    
    return {"message": "Progress updated"}

# ==================== VOCABULARY BANK ====================

@router.get("/vocabulary")
async def get_vocabulary(
    language_id: Optional[int] = None,
    bookmarked: Optional[bool] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's vocabulary bank"""
    query = db.query(VocabularyBank).filter(VocabularyBank.user_id == current_user.id)
    
    if language_id:
        query = query.filter(VocabularyBank.language_id == language_id)
    if bookmarked is not None:
        query = query.filter(VocabularyBank.is_bookmarked == bookmarked)
    
    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "vocabulary": items,
        "total": total,
        "page": page
    }

@router.post("/vocabulary")
async def add_vocabulary(
    word: str,
    translation: str,
    language_id: int,
    category: Optional[str] = None,
    notes: Optional[str] = None,
    source_lesson_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Add word to vocabulary bank"""
    vocab = VocabularyBank(
        user_id=current_user.id,
        word=word,
        translation=translation,
        language_id=language_id,
        category=category,
        notes=notes,
        source_lesson_id=source_lesson_id
    )
    db.add(vocab)
    db.commit()
    db.refresh(vocab)
    
    return {"message": "Word added", "vocabulary_id": vocab.id}

@router.put("/vocabulary/{vocab_id}")
async def update_vocabulary(
    vocab_id: int,
    mastery_level: Optional[int] = None,
    is_bookmarked: Optional[bool] = None,
    notes: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update vocabulary item"""
    vocab = db.query(VocabularyBank).filter(
        VocabularyBank.id == vocab_id,
        VocabularyBank.user_id == current_user.id
    ).first()
    
    if not vocab:
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    
    if mastery_level is not None:
        vocab.mastery_level = mastery_level
    if is_bookmarked is not None:
        vocab.is_bookmarked = is_bookmarked
    if notes is not None:
        vocab.notes = notes
    
    db.commit()
    
    return {"message": "Vocabulary updated"}

# ==================== SPEAKING PRACTICE ====================

@router.get("/speaking/exercises")
async def get_speaking_exercises(
    language_id: Optional[int] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get speaking exercises"""
    query = db.query(SpeakingExercise)
    
    if language_id:
        query = query.filter(SpeakingExercise.language_id == language_id)
    if difficulty:
        query = query.filter(SpeakingExercise.difficulty == difficulty)
    
    exercises = query.limit(50).all()
    return {"exercises": exercises}

@router.post("/speaking/attempts")
async def submit_speaking_attempt(
    exercise_id: int,
    audio_url: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Submit a speaking attempt"""
    exercise = db.query(SpeakingExercise).filter(SpeakingExercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    # In production, this would call an AI service to score
    # For now, we'll just store the attempt
    attempt = SpeakingAttempt(
        user_id=current_user.id,
        exercise_id=exercise_id,
        audio_url=audio_url,
        overall_score_pct=0,  # Would be calculated by AI
        ai_feedback="Audio submitted for review"
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    
    return {
        "message": "Attempt submitted",
        "attempt_id": attempt.id,
        "score": attempt.overall_score_pct,
        "feedback": attempt.ai_feedback
    }

# ==================== LISTENING PRACTICE ====================

@router.get("/listening/exercises")
async def get_listening_exercises(
    language_id: Optional[int] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get listening exercises"""
    query = db.query(ListeningExercise)
    
    if language_id:
        query = query.filter(ListeningExercise.language_id == language_id)
    if difficulty:
        query = query.filter(ListeningExercise.difficulty == difficulty)
    
    exercises = query.limit(50).all()
    return {"exercises": exercises}

@router.post("/listening/attempts")
async def submit_listening_attempt(
    exercise_id: int,
    answer_text: str,
    playback_speed: float = 1.0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Submit a listening attempt"""
    exercise = db.query(ListeningExercise).filter(ListeningExercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    # Simple text matching for demo
    is_correct = answer_text.lower().strip() == exercise.transcript.lower().strip()
    
    attempt = ListeningAttempt(
        user_id=current_user.id,
        exercise_id=exercise_id,
        answer_text=answer_text,
        is_correct=is_correct,
        accuracy_pct=100 if is_correct else 0,
        playback_speed=playback_speed
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    
    return {
        "message": "Attempt submitted",
        "is_correct": is_correct,
        "accuracy_pct": attempt.accuracy_pct,
        "transcript": exercise.transcript if is_correct else None
    }

# ==================== PLACEMENT TEST ====================

PLACEMENT_QUESTIONS = [
    {"id": 1, "question": "How do you say 'Hello' in French?", "options": ["Bonjour", "Hola", "Ciao", "Hallo"], "correct": "Bonjour", "level": "A1"},
    {"id": 2, "question": "What does 'merci' mean?", "options": ["Please", "Sorry", "Thank you", "Excuse me"], "correct": "Thank you", "level": "A1"},
    {"id": 3, "question": "Which article is used with 'maison' (house) in French?", "options": ["le", "la", "les", "un"], "correct": "la", "level": "A1"},
    {"id": 4, "question": "What is 'I am' in French?", "options": ["Je suis", "Tu es", "Il est", "Nous sommes"], "correct": "Je suis", "level": "A1"},
    {"id": 5, "question": "How do you say 'goodbye' in French?", "options": ["Bonjour", "Merci", "Au revoir", "S'il vous plaît"], "correct": "Au revoir", "level": "A1"},
    {"id": 6, "question": "Conjugate 'avoir' (to have) for 'nous' (we)", "options": ["avons", "avez", "ont", "ai"], "correct": "avons", "level": "A2"},
    {"id": 7, "question": "What is the feminine form of 'beau' (beautiful)?", "options": ["beaux", "belle", "bel", "belles"], "correct": "belle", "level": "A2"},
    {"id": 8, "question": "What does 'Je ne parle pas français' mean?", "options": ["I speak French", "I don't speak French", "Do you speak French?", "He speaks French"], "correct": "I don't speak French", "level": "A2"},
    {"id": 9, "question": "Which preposition means 'in front of' in French?", "options": ["derrière", "entre", "devant", "sous"], "correct": "devant", "level": "A2"},
    {"id": 10, "question": "What is 80 in French?", "options": ["huitante", "octante", "quatre-vingts", "quatre-vingt"], "correct": "quatre-vingts", "level": "B1"},
    {"id": 11, "question": "What tense is 'j'ai mangé'?", "options": ["Imperfect", "Future", "Passé composé", "Present"], "correct": "Passé composé", "level": "B1"},
    {"id": 12, "question": "What does 'se lever' mean?", "options": ["to sleep", "to wake up", "to get up", "to get dressed"], "correct": "to get up", "level": "B1"},
    {"id": 13, "question": "Which connector means 'however' in French?", "options": ["donc", "pourtant", "aussi", "puis"], "correct": "pourtant", "level": "B1"},
    {"id": 14, "question": "What is the subjunctive of 'être' for 'que je'?", "options": ["suis", "sois", "serai", "étais"], "correct": "sois", "level": "B2"},
    {"id": 15, "question": "What does 'à condition que' require?", "options": ["indicative", "infinitive", "subjunctive", "conditional"], "correct": "subjunctive", "level": "B2"},
    {"id": 16, "question": "Translate: 'Had I known, I would have come.'", "options": ["Si je savais, je venais", "Si j'avais su, je serais venu", "Si je sais, je viens", "Si je saurais, je vendrais"], "correct": "Si j'avais su, je serais venu", "level": "B2"},
    {"id": 17, "question": "What literary tense replaces passé composé in formal writing?", "options": ["Imperfect", "Passé simple", "Pluperfect", "Future anterior"], "correct": "Passé simple", "level": "C1"},
    {"id": 18, "question": "What is the meaning of 'nonobstant'?", "options": ["therefore", "notwithstanding", "furthermore", "meanwhile"], "correct": "notwithstanding", "level": "C1"},
    {"id": 19, "question": "Which verb form is used in 'Qu'il vienne ou non'?", "options": ["Indicative", "Infinitive", "Subjunctive", "Conditional"], "correct": "Subjunctive", "level": "C2"},
    {"id": 20, "question": "What stylistic device is 'La vie est un long fleuve tranquille'?", "options": ["Metaphor", "Simile", "Metonymy", "Synecdoche"], "correct": "Metaphor", "level": "C2"},
]

@router.get("/placement-test")
async def get_placement_test(
    current_user: User = Depends(get_current_active_user)
):
    """Get placement test questions"""
    questions = [
        {"id": q["id"], "question": q["question"], "options": q["options"], "level": q["level"]}
        for q in PLACEMENT_QUESTIONS
    ]
    return {"questions": questions}


@router.post("/placement-test/submit")
async def submit_placement_test(
    answers: dict,
    current_user: User = Depends(get_current_active_user)
):
    """Submit placement test and get CEFR level result"""
    user_answers = answers.get("answers", {})
    correct = 0
    total = len(PLACEMENT_QUESTIONS)
    level_scores = {"A1": 0, "A2": 0, "B1": 0, "B2": 0, "C1": 0, "C2": 0}
    level_totals = {"A1": 0, "A2": 0, "B1": 0, "B2": 0, "C1": 0, "C2": 0}
    for q in PLACEMENT_QUESTIONS:
        qid = str(q["id"])
        level_totals[q["level"]] += 1
        if user_answers.get(qid) == q["correct"]:
            correct += 1
            level_scores[q["level"]] += 1
    score_pct = (correct / total) * 100 if total > 0 else 0
    if score_pct >= 90:
        cefr_level = "C2"
    elif score_pct >= 75:
        cefr_level = "C1"
    elif score_pct >= 60:
        cefr_level = "B2"
    elif score_pct >= 45:
        cefr_level = "B1"
    elif score_pct >= 30:
        cefr_level = "A2"
    else:
        cefr_level = "A1"
    return {
        "cefr_level": cefr_level,
        "score": correct,
        "total": total,
        "score_pct": round(score_pct, 1),
        "level_breakdown": {
            level: {"correct": level_scores[level], "total": level_totals[level]}
            for level in level_scores
        }
    }

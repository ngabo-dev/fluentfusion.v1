"""
Seed script to populate FluentFusion database with tourism-focused lessons
"""
import sys
import os
import json

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from app.database import engine, Base, SessionLocal
from app.models import Lesson, Exercise, Badge

def create_tables():
    """Create database tables"""
    Base.metadata.create_all(bind=engine)

def seed_lessons(db):
    """Seed lessons with Rwanda tourism content"""
    
    lessons_data = [
        {
            "lesson_id": "L001",
            "title": "Essential Greetings & Courtesies",
            "description": "Learn basic Kinyarwanda greetings and polite expressions for everyday interactions",
            "difficulty": "beginner",
            "category": "greetings",
            "target_language": "kinyarwanda",
            "duration": 15,
            "vocabulary_count": 12,
            "thumbnail": "greeting",
            "content": {
                "vocabulary": [
                    {"word": "Muraho", "translation": "Hello", "pronunciation": "moo-rah-ho", "example": "Muraho! Amakuru?"},
                    {"word": "Mwaramutse", "translation": "Good morning", "pronunciation": "mwa-ra-moot-say", "example": "Mwaramutse, mwiriwe!"},
                    {"word": "Mwiriwe", "translation": "Good afternoon/evening", "pronunciation": "mwee-ree-way", "example": "Mwiriwe, amakuru?"},
                    {"word": "Ijoro ryiza", "translation": "Good night", "pronunciation": "ee-jo-ro ree-za", "example": "Ijoro ryiza, urakoze!"},
                    {"word": "Amakuru?", "translation": "How are you?", "pronunciation": "ah-ma-koo-roo", "example": "Amakuru yawe?"},
                    {"word": "Ni meza", "translation": "I'm fine", "pronunciation": "nee meh-za", "example": "Ni meza, urakoze!"},
                    {"word": "Urakoze", "translation": "Thank you", "pronunciation": "oo-ra-ko-zeh", "example": "Urakoze cyane!"},
                    {"word": "Urakoze cyane", "translation": "Thank you very much", "pronunciation": "oo-ra-ko-zeh cha-neh", "example": "Urakoze cyane ku bufasha!"},
                    {"word": "Murabeho", "translation": "Goodbye", "pronunciation": "moo-ra-beh-ho", "example": "Murabeho, tuzabonana!"},
                    {"word": "Nimwiriwe", "translation": "You are welcome", "pronunciation": "neem-wee-ree-way", "example": "Nimwiriwe, ntakibazo!"},
                    {"word": "Mwaramutse neza", "translation": "Good morning (polite)", "pronunciation": "mwa-ra-moot-say neh-za", "example": "Mwaramutse neza, nshuti!"},
                    {"word": "Ego/Oya", "translation": "Yes/No", "pronunciation": "eh-go/o-ya", "example": "Ego, ndareba. Oya, simbizi."},
                ],
                "phrases": [
                    {"phrase": "Amakuru yawe?", "translation": "How are you?", "pronunciation": "ah-ma-koo-roo ya-weh", "context": "Casual greeting"},
                    {"phrase": "Ni meza, urakoze", "translation": "I'm fine, thank you", "pronunciation": "nee meh-za oo-ra-ko-zeh", "context": "Response to greeting"},
                    {"phrase": "Nitwa...", "translation": "My name is...", "pronunciation": "nee-twa", "context": "Introducing yourself"},
                    {"phrase": "Wowe witwa nde?", "translation": "What is your name?", "pronunciation": "wo-weh wee-twa ndeh", "context": "Asking someone's name"},
                    {"phrase": "Ni impuhwe", "translation": "Nice to meet you", "pronunciation": "nee eem-poo-hweh", "context": "First meeting"},
                    {"phrase": "Imbabazi", "translation": "Excuse me/Sorry", "pronunciation": "eem-ba-ba-zee", "context": "Apologizing"},
                ],
                "cultural_notes": [
                    "In Rwandan culture, greetings are very important and often extended",
                    "It's polite to ask about someone's well-being before starting a conversation",
                    "Handshakes are common, often accompanied by touching the right elbow with the left hand as a sign of respect",
                ]
            }
        },
        {
            "lesson_id": "L002",
            "title": "Hotel & Accommodation Essentials",
            "description": "Master key phrases for checking in, requesting services, and communicating at hotels",
            "difficulty": "beginner",
            "category": "accommodation",
            "target_language": "kinyarwanda",
            "duration": 20,
            "vocabulary_count": 15,
            "thumbnail": "hotel",
            "content": {
                "vocabulary": [
                    {"word": "Hoteri", "translation": "Hotel", "pronunciation": "ho-teh-ree", "example": "Hoteli iri he?"},
                    {"word": "Icyumba", "translation": "Room", "pronunciation": "ee-choom-ba", "example": "Ndashaka icyumba"},
                    {"word": "Urufunguzo", "translation": "Key", "pronunciation": "oo-roo-foon-goo-zo", "example": "Urufunguzo rw'icyumba"},
                    {"word": "Amafranga", "translation": "Money/Price", "pronunciation": "ah-ma-fran-ga", "example": "Ni amafranga angahe?"},
                    {"word": "Uburiri", "translation": "Bed", "pronunciation": "oo-boo-ree-ree", "example": "Icyumba gifite uburiri bubiri"},
                    {"word": "Isuku", "translation": "Clean", "pronunciation": "ee-soo-koo", "example": "Icyumba kirimo isuku"},
                    {"word": "Amazi", "translation": "Water", "pronunciation": "ah-ma-zee", "example": "Ndashaka amazi ashyushye"},
                    {"word": "Umunsi", "translation": "Day", "pronunciation": "oo-moon-see", "example": "Nzaba hano iminsi itatu"},
                    {"word": "Gufata", "translation": "To book/take", "pronunciation": "goo-fa-ta", "example": "Ndashaka gufata icyumba"},
                    {"word": "Ubufasha", "translation": "Help", "pronunciation": "oo-boo-fa-sha", "example": "Ndakeneye ubufasha"},
                    {"word": "Wifi", "translation": "WiFi", "pronunciation": "wee-fee", "example": "Hari wifi?"},
                    {"word": "Ifunguro", "translation": "Meal/Breakfast", "pronunciation": "ee-foon-goo-ro", "example": "Ifunguro rya mu gitondo"},
                    {"word": "Imanza", "translation": "Towel", "pronunciation": "ee-man-za", "example": "Ndashaka imanza"},
                    {"word": "Isaha", "translation": "Time/Hour", "pronunciation": "ee-sa-ha", "example": "Ni isaha ngahe?"},
                ],
                "phrases": [
                    {"phrase": "Ndashaka gufata icyumba", "translation": "I want to book a room", "pronunciation": "nda-sha-ka goo-fa-ta ee-choom-ba", "context": "At hotel reception"},
                    {"phrase": "Ni amafranga angahe ku ijoro?", "translation": "How much per night?", "pronunciation": "nee ah-ma-fran-ga an-ga-heh koo ee-jo-ro", "context": "Asking about price"},
                    {"phrase": "Icyumba gifite wifi?", "translation": "Does the room have WiFi?", "pronunciation": "ee-choom-ba gee-fee-teh wee-fee", "context": "Inquiring about amenities"},
                    {"phrase": "Mwafasha gukora isuku?", "translation": "Can you clean the room?", "pronunciation": "mwa-fa-sha goo-ko-ra ee-soo-koo", "context": "Requesting service"},
                ],
                "cultural_notes": [
                    "Rwandan hotels range from budget to luxury, with many eco-lodges near national parks",
                    "Tipping is appreciated but not mandatory in Rwanda",
                    "Always greet staff politely before making requests",
                ]
            }
        },
        {
            "lesson_id": "L003",
            "title": "Restaurant & Food Ordering",
            "description": "Learn to order food, ask about dishes, and handle restaurant interactions",
            "difficulty": "beginner",
            "category": "food",
            "target_language": "kinyarwanda",
            "duration": 25,
            "vocabulary_count": 18,
            "thumbnail": "food",
            "content": {
                "vocabulary": [
                    {"word": "Ibiryo", "translation": "Food", "pronunciation": "ee-bee-ryo", "example": "Ibiryo biryoha?"},
                    {"word": "Ikinyobwa", "translation": "Drink/Beverage", "pronunciation": "ee-keen-yo-bwa", "example": "Ndashaka ikinyobwa"},
                    {"word": "Resitora", "translation": "Restaurant", "pronunciation": "reh-see-to-ra", "example": "Resitora iri he?"},
                    {"word": "Umwuka", "translation": "Menu", "pronunciation": "oom-woo-ka", "example": "Mpa umwuka"},
                    {"word": "Gusaba", "translation": "To order/ask for", "pronunciation": "goo-sa-ba", "example": "Ndashaka gusaba ibiryo"},
                    {"word": "Umuneke", "translation": "Delicious", "pronunciation": "oo-moo-neh-keh", "example": "Ibiryo biryoshye cyane!"},
                    {"word": "Ishyushya", "translation": "Hot (temperature)", "pronunciation": "ee-shyoo-shya", "example": "Ndashaka ikinyobwa gishyushye"},
                    {"word": "Gikonje", "translation": "Cold", "pronunciation": "gee-kon-jeh", "example": "Amazi akonje"},
                    {"word": "Umuceri", "translation": "Rice", "pronunciation": "oo-moo-cheh-ree", "example": "Ndashaka umuceri n'inyama"},
                    {"word": "Inyama", "translation": "Meat", "pronunciation": "een-ya-ma", "example": "Inyama y'inka"},
                    {"word": "Ibirayi", "translation": "Potatoes", "pronunciation": "ee-bee-ra-yee", "example": "Ibirayi byakaye"},
                    {"word": "Imboga", "translation": "Vegetables", "pronunciation": "eem-bo-ga", "example": "Ndashaka imboga"},
                    {"word": "Icyayi", "translation": "Tea", "pronunciation": "ee-cha-yee", "example": "Icyayi gishyushye"},
                    {"word": "Ikawa", "translation": "Coffee", "pronunciation": "ee-ka-wa", "example": "Ikawa y'u Rwanda"},
                    {"word": "Kwishyura", "translation": "To pay", "pronunciation": "kwee-shyoo-ra", "example": "Ndashaka kwishyura"},
                ],
                "phrases": [
                    {"phrase": "Ndashaka gusaba ibiryo", "translation": "I want to order food", "pronunciation": "nda-sha-ka goo-sa-ba ee-bee-ryo", "context": "Starting an order"},
                    {"phrase": "Mpa umwuka", "translation": "Give me the menu", "pronunciation": "mpa oom-woo-ka", "context": "Requesting menu"},
                    {"phrase": "Ni amafranga angahe?", "translation": "How much is it?", "pronunciation": "nee ah-ma-fran-ga an-ga-heh", "context": "Asking price"},
                    {"phrase": "Ibiryo biryoshye cyane!", "translation": "The food is very delicious!", "pronunciation": "ee-bee-ryo bee-ryo-shyeh cha-neh", "context": "Complimenting food"},
                    {"phrase": "Ndashaka kwishyura", "translation": "I want to pay", "pronunciation": "nda-sha-ka kwee-shyoo-ra", "context": "Requesting the bill"},
                ],
                "cultural_notes": [
                    "Traditional Rwandan cuisine includes dishes like isombe (cassava leaves), mizuzu (fried plantains), and brochettes",
                    "Eating with your hands is acceptable for some traditional dishes",
                    "Rwandan coffee is world-renowned and should definitely be tried",
                    "It's polite to say 'Urakoze' (thank you) when receiving your food",
                ]
            }
        },
        {
            "lesson_id": "L004",
            "title": "Transportation & Directions",
            "description": "Navigate Rwanda with confidence - taxis, buses, and asking for directions",
            "difficulty": "intermediate",
            "category": "transportation",
            "target_language": "kinyarwanda",
            "duration": 20,
            "vocabulary_count": 16,
            "thumbnail": "transportation",
            "content": {
                "vocabulary": [
                    {"word": "Bisi", "translation": "Bus", "pronunciation": "bee-see", "example": "Bisi ya Kigali"},
                    {"word": "Takisi", "translation": "Taxi", "pronunciation": "ta-kee-see", "example": "Ndashaka takisi"},
                    {"word": "Inzira", "translation": "Road/Way", "pronunciation": "een-zee-ra", "example": "Inzira ya Gisenyi"},
                    {"word": "Kure", "translation": "Far", "pronunciation": "koo-reh", "example": "Ni kure cyane"},
                    {"word": "Hafi", "translation": "Near", "pronunciation": "ha-fee", "example": "Ni hafi"},
                    {"word": "Iburyo", "translation": "Right", "pronunciation": "ee-boo-ryo", "example": "Hindukira iburyo"},
                    {"word": "Ibumoso", "translation": "Left", "pronunciation": "ee-boo-mo-so", "example": "Hindukira ibumoso"},
                    {"word": "Imbere", "translation": "Front/Forward", "pronunciation": "eem-beh-reh", "example": "Komeza imbere"},
                    {"word": "Inyuma", "translation": "Back/Behind", "pronunciation": "een-yoo-ma", "example": "Subira inyuma"},
                    {"word": "Ahantu", "translation": "Place", "pronunciation": "ah-han-too", "example": "Aha hantu"},
                    {"word": "Guhaguruka", "translation": "To stop", "pronunciation": "goo-ha-goo-roo-ka", "example": "Hagarara hano"},
                    {"word": "Kugenda", "translation": "To go", "pronunciation": "koo-gen-da", "example": "Ndashaka kugenda i Kigali"},
                ],
                "phrases": [
                    {"phrase": "Ndashaka kugenda i Kigali", "translation": "I want to go to Kigali", "pronunciation": "nda-sha-ka koo-gen-da ee Kigali", "context": "Stating destination"},
                    {"phrase": "Ni kure cyane?", "translation": "Is it very far?", "pronunciation": "nee koo-reh cha-neh", "context": "Asking about distance"},
                    {"phrase": "Hagarara hano", "translation": "Stop here", "pronunciation": "ha-ga-ra-ra ha-no", "context": "Telling driver to stop"},
                    {"phrase": "Hindukira iburyo", "translation": "Turn right", "pronunciation": "heen-doo-kee-ra ee-boo-ryo", "context": "Giving directions"},
                    {"phrase": "Komeza imbere", "translation": "Go straight ahead", "pronunciation": "ko-meh-za eem-beh-reh", "context": "Giving directions"},
                    {"phrase": "Ni amafranga angahe?", "translation": "How much is the fare?", "pronunciation": "nee ah-ma-fran-ga an-ga-heh", "context": "Asking taxi fare"},
                ],
                "cultural_notes": [
                    "Motorcycle taxis (moto) are very popular and affordable in Rwanda",
                    "All motorcycle riders are required to wear helmets by law",
                    "Kigali has a modern public bus system with cashless payment",
                    "Always negotiate taxi fares before starting your journey",
                ]
            }
        },
        {
            "lesson_id": "L005",
            "title": "Shopping at Markets",
            "description": "Bargain like a local and navigate Rwanda's vibrant markets with confidence",
            "difficulty": "intermediate",
            "category": "shopping",
            "target_language": "kinyarwanda",
            "duration": 22,
            "vocabulary_count": 17,
            "thumbnail": "shopping",
            "content": {
                "vocabulary": [
                    {"word": "Isoko", "translation": "Market", "pronunciation": "ee-so-ko", "example": "Isoko rya Kimironko"},
                    {"word": "Kugura", "translation": "To buy", "pronunciation": "koo-goo-ra", "example": "Ndashaka kugura"},
                    {"word": "Kugurisha", "translation": "To sell", "pronunciation": "koo-goo-ree-sha", "example": "Uragurisha iki?"},
                    {"word": "Igiciro", "translation": "Price", "pronunciation": "ee-gee-chee-ro", "example": "Igiciro ni iki?"},
                    {"word": "Guhindura", "translation": "To bargain/change", "pronunciation": "goo-heen-doo-ra", "example": "Twaguhindura igiciro"},
                    {"word": "Guhenda", "translation": "Cheap/Affordable", "pronunciation": "goo-hen-da", "example": "Ni guhenda"},
                    {"word": "Guhenze", "translation": "Expensive", "pronunciation": "goo-hen-zeh", "example": "Ni guhenze cyane"},
                    {"word": "Imyenda", "translation": "Clothes", "pronunciation": "eem-yen-da", "example": "Ndashaka kugura imyenda"},
                    {"word": "Imbuto", "translation": "Fruits", "pronunciation": "eem-boo-to", "example": "Imbuto nziza"},
                    {"word": "Umutuku", "translation": "Red", "pronunciation": "oo-moo-too-koo", "example": "Imyenda itukura"},
                    {"word": "Umweru", "translation": "White", "pronunciation": "oom-weh-roo", "example": "Imyenda yera"},
                ],
                "phrases": [
                    {"phrase": "Ni amafranga angahe?", "translation": "How much is it?", "pronunciation": "nee ah-ma-fran-ga an-ga-heh", "context": "Asking price"},
                    {"phrase": "Ni guhenze cyane", "translation": "It's too expensive", "pronunciation": "nee goo-hen-zeh cha-neh", "context": "Expressing price concern"},
                    {"phrase": "Wampa igihendutse?", "translation": "Can you give me a discount?", "pronunciation": "wam-pa ee-gee-hen-doot-seh", "context": "Bargaining"},
                    {"phrase": "Nzagura ibi", "translation": "I will buy this", "pronunciation": "nza-goo-ra ee-bee", "context": "Deciding to purchase"},
                ],
                "cultural_notes": [
                    "Kimironko Market in Kigali is one of the largest and most vibrant markets",
                    "Bargaining is expected and part of the shopping culture",
                    "Start by offering 60-70% of the asking price",
                    "Rwandan crafts like baskets (agaseke) make excellent souvenirs",
                    "Markets are busiest in the morning",
                ]
            }
        },
        {
            "lesson_id": "L006",
            "title": "Emergency Phrases",
            "description": "Essential phrases for emergencies and safety situations",
            "difficulty": "beginner",
            "category": "emergency",
            "target_language": "kinyarwanda",
            "duration": 18,
            "vocabulary_count": 14,
            "thumbnail": "emergency",
            "content": {
                "vocabulary": [
                    {"word": "Ubufasha", "translation": "Help", "pronunciation": "oo-boo-fa-sha", "example": "Ndakeneye ubufasha!"},
                    {"word": "Akaga", "translation": "Emergency/Danger", "pronunciation": "ah-ka-ga", "example": "Hari akaga!"},
                    {"word": "Polisi", "translation": "Police", "pronunciation": "po-lee-see", "example": "Hamagara polisi"},
                    {"word": "Ikibazo", "translation": "Problem", "pronunciation": "ee-kee-ba-zo", "example": "Hari ikibazo"},
                    {"word": "Indwara", "translation": "Illness/Sick", "pronunciation": "een-dwa-ra", "example": "Ndarwaye"},
                    {"word": "Muganga", "translation": "Doctor", "pronunciation": "moo-gan-ga", "example": "Ndakeneye muganga"},
                    {"word": "Ibitaro", "translation": "Hospital", "pronunciation": "ee-bee-ta-ro", "example": "Ibitaro riri he?"},
                    {"word": "Umuti", "translation": "Medicine", "pronunciation": "oo-moo-tee", "example": "Ndakeneye umuti"},
                    {"word": "Kwiba", "translation": "To steal", "pronunciation": "kwee-ba", "example": "Banyivye"},
                    {"word": "Umutekano", "translation": "Security/Safety", "pronunciation": "oo-moo-teh-ka-no", "example": "Umutekano ni mwiza"},
                ],
                "phrases": [
                    {"phrase": "Ndakeneye ubufasha!", "translation": "I need help!", "pronunciation": "nda-keh-neh-yeh oo-boo-fa-sha", "context": "Emergency call"},
                    {"phrase": "Hamagara polisi!", "translation": "Call the police!", "pronunciation": "ha-ma-ga-ra po-lee-see", "context": "Emergency situation"},
                    {"phrase": "Ibitaro riri he?", "translation": "Where is the hospital?", "pronunciation": "ee-bee-ta-ro ree-ree heh", "context": "Medical emergency"},
                    {"phrase": "Ndarwaye", "translation": "I am sick", "pronunciation": "nda-rwa-yeh", "context": "Feeling ill"},
                    {"phrase": "Banyivye!", "translation": "I was robbed!", "pronunciation": "ban-yeev-yeh", "context": "Reporting theft"},
                ],
                "cultural_notes": [
                    "Rwanda is generally very safe for tourists",
                    "Emergency number in Rwanda: 112 (Police), 912 (Medical)",
                    "Most police officers in tourist areas speak English",
                    "Rwandan people are typically very helpful in emergencies",
                ]
            }
        },
        {
            "lesson_id": "L007",
            "title": "English Basics for Tourism Workers",
            "description": "Essential English phrases for Rwandan tourism professionals",
            "difficulty": "beginner",
            "category": "greetings",
            "target_language": "english",
            "duration": 20,
            "vocabulary_count": 15,
            "thumbnail": "greeting",
            "content": {
                "vocabulary": [
                    {"word": "Welcome", "translation": "Murakaza neza", "pronunciation": "wel-kum", "example": "Welcome to Rwanda!"},
                    {"word": "Hello", "translation": "Muraho", "pronunciation": "heh-lo", "example": "Hello, how can I help you?"},
                    {"word": "Thank you", "translation": "Urakoze", "pronunciation": "thank yoo", "example": "Thank you very much!"},
                    {"word": "Please", "translation": "Nyamuneka", "pronunciation": "pleez", "example": "Please wait here"},
                    {"word": "Tourist", "translation": "Umukerarugendo", "pronunciation": "too-rist", "example": "Are you a tourist?"},
                    {"word": "Reservation", "translation": "Gutumiza", "pronunciation": "reh-zer-vay-shun", "example": "Do you have a reservation?"},
                    {"word": "Room", "translation": "Icyumba", "pronunciation": "room", "example": "Your room is ready"},
                    {"word": "Price", "translation": "Igiciro", "pronunciation": "prais", "example": "The price is 50 dollars"},
                    {"word": "Receipt", "translation": "Impapuro", "pronunciation": "ri-seet", "example": "Here is your receipt"},
                    {"word": "Direction", "translation": "Icyerekezo", "pronunciation": "di-rek-shun", "example": "Which direction?"},
                ],
                "phrases": [
                    {"phrase": "Welcome to Rwanda!", "translation": "Murakaza neza mu Rwanda!", "pronunciation": "wel-kum too rwan-da", "context": "Greeting tourists"},
                    {"phrase": "How can I help you?", "translation": "Nagukorera iki?", "pronunciation": "how kan ai help yoo", "context": "Offering assistance"},
                    {"phrase": "Do you have a reservation?", "translation": "Ufite gutumiza?", "pronunciation": "doo yoo hav a reh-zer-vay-shun", "context": "At hotel/restaurant"},
                    {"phrase": "Please follow me", "translation": "Nyamuneka unkurikire", "pronunciation": "pleez fol-o mee", "context": "Guiding guests"},
                    {"phrase": "Enjoy your stay!", "translation": "Wishimire igihe uzaba hano!", "pronunciation": "en-joy yor stay", "context": "Wishing guests well"},
                ],
                "cultural_notes": [
                    "Many tourists appreciate when locals make an effort to speak English",
                    "Simple English phrases can greatly enhance tourist experiences",
                    "Body language and smiling are universally understood",
                ]
            }
        },
    ]
    
    # Insert lessons
    for lesson_data in lessons_data:
        existing = db.query(Lesson).filter(Lesson.lesson_id == lesson_data["lesson_id"]).first()
        if not existing:
            lesson = Lesson(**lesson_data)
            db.add(lesson)
    
    db.commit()
    print(f"✓ Seeded {len(lessons_data)} lessons")

def seed_exercises(db):
    """Seed exercises for each lesson"""
    
    exercises_data = [
        # Lesson 1 - Greetings
        {
            "exercise_id": "E001",
            "lesson_id": "L001",
            "type": "multiple_choice",
            "prompt": "How do you say 'Good morning' in Kinyarwanda?",
            "options": json.dumps(["Muraho", "Mwaramutse", "Mwiriwe", "Murabeho"]),
            "correct_answer": "Mwaramutse",
            "explanation": "Mwaramutse is used specifically for morning greetings",
            "points": 10
        },
        {
            "exercise_id": "E002",
            "lesson_id": "L001",
            "type": "multiple_choice",
            "prompt": "What does 'Urakoze' mean?",
            "options": json.dumps(["Hello", "Thank you", "Goodbye", "Good night"]),
            "correct_answer": "Thank you",
            "explanation": "Urakoze is the standard way to say thank you in Kinyarwanda",
            "points": 10
        },
        {
            "exercise_id": "E003",
            "lesson_id": "L001",
            "type": "fill_blank",
            "prompt": "Complete: Amakuru _____? (How are you?)",
            "options": None,
            "correct_answer": "yawe",
            "explanation": "Yawe means 'your', making the complete phrase 'your news?'",
            "points": 15
        },
        {
            "exercise_id": "E004",
            "lesson_id": "L001",
            "type": "matching",
            "prompt": "Match the greeting with its meaning",
            "options": json.dumps(["Muraho", "Murabeho", "Ijoro ryiza", "Ni meza"]),
            "correct_answer": json.dumps(["Hello", "Goodbye", "Good night", "I'm fine"]),
            "explanation": None,
            "points": 20
        },
        # Lesson 2 - Hotel
        {
            "exercise_id": "E005",
            "lesson_id": "L002",
            "type": "multiple_choice",
            "prompt": "How do you ask 'How much per night?' in Kinyarwanda?",
            "options": json.dumps(["Ndashaka icyumba", "Ni amafranga angahe ku ijoro?", "Icyumba gifite wifi?", "Murabeho"]),
            "correct_answer": "Ni amafranga angahe ku ijoro?",
            "explanation": "This phrase specifically asks about the nightly rate",
            "points": 10
        },
        {
            "exercise_id": "E006",
            "lesson_id": "L002",
            "type": "fill_blank",
            "prompt": "Complete: Ndashaka _____ (I want a room)",
            "options": None,
            "correct_answer": "icyumba",
            "explanation": "Icyumba means room",
            "points": 15
        },
        {
            "exercise_id": "E007",
            "lesson_id": "L002",
            "type": "multiple_choice",
            "prompt": "What does 'Urufunguzo' mean?",
            "options": json.dumps(["Room", "Key", "Bed", "Water"]),
            "correct_answer": "Key",
            "explanation": None,
            "points": 10
        },
        # Lesson 3 - Food
        {
            "exercise_id": "E008",
            "lesson_id": "L003",
            "type": "multiple_choice",
            "prompt": "How do you say 'I want to order food'?",
            "options": json.dumps(["Ndashaka ibiryo", "Ndashaka gusaba ibiryo", "Mpa umwuka", "Ndashaka kwishyura"]),
            "correct_answer": "Ndashaka gusaba ibiryo",
            "explanation": "Gusaba means to order or ask for",
            "points": 10
        },
        {
            "exercise_id": "E009",
            "lesson_id": "L003",
            "type": "fill_blank",
            "prompt": "Complete: Mpa _____ (Give me the menu)",
            "options": None,
            "correct_answer": "umwuka",
            "explanation": "Umwuka means menu",
            "points": 15
        },
        {
            "exercise_id": "E010",
            "lesson_id": "L003",
            "type": "matching",
            "prompt": "Match the food items",
            "options": json.dumps(["Umuceri", "Inyama", "Icyayi", "Imboga"]),
            "correct_answer": json.dumps(["Rice", "Meat", "Tea", "Vegetables"]),
            "explanation": None,
            "points": 20
        },
        # Lesson 4 - Transportation
        {
            "exercise_id": "E011",
            "lesson_id": "L004",
            "type": "multiple_choice",
            "prompt": "How do you say 'Turn right' in Kinyarwanda?",
            "options": json.dumps(["Hindukira ibumoso", "Hindukira iburyo", "Komeza imbere", "Hagarara hano"]),
            "correct_answer": "Hindukira iburyo",
            "explanation": None,
            "points": 10
        },
        {
            "exercise_id": "E012",
            "lesson_id": "L004",
            "type": "fill_blank",
            "prompt": "Complete: Komeza _____ (Go straight ahead)",
            "options": None,
            "correct_answer": "imbere",
            "explanation": None,
            "points": 15
        },
        {
            "exercise_id": "E013",
            "lesson_id": "L004",
            "type": "multiple_choice",
            "prompt": "What is the word for 'bus' in Kinyarwanda?",
            "options": json.dumps(["Takisi", "Bisi", "Inzira", "Ikinyabiziga"]),
            "correct_answer": "Bisi",
            "explanation": None,
            "points": 10
        },
        # Lesson 5 - Shopping
        {
            "exercise_id": "E014",
            "lesson_id": "L005",
            "type": "multiple_choice",
            "prompt": "How do you say 'It's too expensive'?",
            "options": json.dumps(["Ni guhenda", "Ni guhenze cyane", "Ndashaka kugura", "Ni nziza cyane"]),
            "correct_answer": "Ni guhenze cyane",
            "explanation": None,
            "points": 10
        },
        {
            "exercise_id": "E015",
            "lesson_id": "L005",
            "type": "fill_blank",
            "prompt": "Complete: Wampa _____? (Can you give me a discount?)",
            "options": None,
            "correct_answer": "igihendutse",
            "explanation": None,
            "points": 15
        },
        {
            "exercise_id": "E016",
            "lesson_id": "L005",
            "type": "multiple_choice",
            "prompt": "What does 'Kugura' mean?",
            "options": json.dumps(["To sell", "To buy", "To bargain", "To look"]),
            "correct_answer": "To buy",
            "explanation": None,
            "points": 10
        },
        # Lesson 6 - Emergency
        {
            "exercise_id": "E017",
            "lesson_id": "L006",
            "type": "multiple_choice",
            "prompt": "How do you say 'I need help!' in Kinyarwanda?",
            "options": json.dumps(["Hari akaga", "Ndakeneye ubufasha", "Hamagara polisi", "Ndarwaye"]),
            "correct_answer": "Ndakeneye ubufasha",
            "explanation": None,
            "points": 10
        },
        {
            "exercise_id": "E018",
            "lesson_id": "L006",
            "type": "fill_blank",
            "prompt": "Complete: Ibitaro riri _____? (Where is the hospital?)",
            "options": None,
            "correct_answer": "he",
            "explanation": None,
            "points": 15
        },
        {
            "exercise_id": "E019",
            "lesson_id": "L006",
            "type": "matching",
            "prompt": "Match the emergency terms",
            "options": json.dumps(["Polisi", "Muganga", "Ibitaro", "Umuti"]),
            "correct_answer": json.dumps(["Police", "Doctor", "Hospital", "Medicine"]),
            "explanation": None,
            "points": 20
        },
        # Lesson 7 - English for Workers
        {
            "exercise_id": "E020",
            "lesson_id": "L007",
            "type": "multiple_choice",
            "prompt": "How do you greet tourists in English?",
            "options": json.dumps(["Goodbye", "Welcome to Rwanda", "Thank you", "Please wait"]),
            "correct_answer": "Welcome to Rwanda",
            "explanation": None,
            "points": 10
        },
        {
            "exercise_id": "E021",
            "lesson_id": "L007",
            "type": "fill_blank",
            "prompt": "Complete: How can I _____ you? (offer help)",
            "options": None,
            "correct_answer": "help",
            "explanation": None,
            "points": 15
        },
        {
            "exercise_id": "E022",
            "lesson_id": "L007",
            "type": "multiple_choice",
            "prompt": "What does 'reservation' mean in Kinyarwanda?",
            "options": json.dumps(["Icyumba", "Gutumiza", "Igiciro", "Amakuru"]),
            "correct_answer": "Gutumiza",
            "explanation": None,
            "points": 10
        },
    ]
    
    for ex_data in exercises_data:
        existing = db.query(Exercise).filter(Exercise.exercise_id == ex_data["exercise_id"]).first()
        if not existing:
            exercise = Exercise(**ex_data)
            db.add(exercise)
    
    db.commit()
    print(f"✓ Seeded {len(exercises_data)} exercises")

def seed_badges(db):
    """Seed achievement badges"""
    
    badges_data = [
        {
            "badge_id": "B001",
            "name": "First Steps",
            "description": "Complete your first lesson",
            "icon": "🎯",
            "criteria": {"lessons_completed": 1}
        },
        {
            "badge_id": "B002",
            "name": "Conversationalist",
            "description": "Complete 5 lessons",
            "icon": "💬",
            "criteria": {"lessons_completed": 5}
        },
        {
            "badge_id": "B003",
            "name": "Language Enthusiast",
            "description": "Complete 10 lessons",
            "icon": "⭐",
            "criteria": {"lessons_completed": 10}
        },
        {
            "badge_id": "B004",
            "name": "Perfect Score",
            "description": "Score 100% on any lesson",
            "icon": "🏆",
            "criteria": {"score": 100}
        },
        {
            "badge_id": "B005",
            "name": "Quick Learner",
            "description": "Complete a lesson in under 10 minutes",
            "icon": "⚡",
            "criteria": {"time_spent": 600}
        },
        {
            "badge_id": "B006",
            "name": "Culture Explorer",
            "description": "Read all cultural notes",
            "icon": "🌍",
            "criteria": {"cultural_notes_read": "all"}
        },
        {
            "badge_id": "B007",
            "name": "Vocabulary Master",
            "description": "Learn 100 new words",
            "icon": "📚",
            "criteria": {"vocabulary_learned": 100}
        },
        {
            "badge_id": "B008",
            "name": "Week Streak",
            "description": "Practice for 7 consecutive days",
            "icon": "🔥",
            "criteria": {"streak": 7}
        },
    ]
    
    for badge_data in badges_data:
        existing = db.query(Badge).filter(Badge.badge_id == badge_data["badge_id"]).first()
        if not existing:
            badge = Badge(**badge_data)
            db.add(badge)
    
    db.commit()
    print(f"✓ Seeded {len(badges_data)} badges")

def main():
    """Main seed function"""
    print("🌱 Seeding FluentFusion database...")
    
    # Create tables
    create_tables()
    print("✓ Database tables created")
    
    # Get database session
    db = SessionLocal()
    
    try:
        # Seed data
        seed_lessons(db)
        seed_exercises(db)
        seed_badges(db)
        
        print("\n✅ Database seeding completed successfully!")
        print("\n📚 Summary:")
        print("   - Lessons: 7 tourism-focused lessons")
        print("   - Exercises: 22 interactive exercises")
        print("   - Badges: 8 achievement badges")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()

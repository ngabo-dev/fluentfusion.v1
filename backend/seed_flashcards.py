"""
Seed script to add system flashcard decks and sample cards to the database.
Run with: python seed_flashcards.py
"""
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models.practice import FlashcardDeck, Flashcard
from app.models.language import Language


def seed_flashcards():
    """Seed system flashcard decks with sample cards."""
    db = SessionLocal()
    
    try:
        # Check if Language table exists
        Base.metadata.create_all(bind=engine)
        
        # Get or create Kinyarwanda language
        language = db.query(Language).filter(Language.code == "rw").first()
        if not language:
            language = Language(
                code="rw",
                name="Kinyarwanda",
                native_name="Ikinyarwanda",
                flag_emoji="🇷🇼"
            )
            db.add(language)
            db.commit()
            db.refresh(language)
            print(f"Created language: {language.name}")
        else:
            print(f"Found language: {language.name}")
        
        # Check if system deck already exists
        existing_deck = db.query(FlashcardDeck).filter(
            FlashcardDeck.is_system == True,
            FlashcardDeck.name == "Greetings"
        ).first()
        
        if existing_deck:
            print(f"System deck 'Greetings' already exists with {existing_deck.card_count} cards")
            deck = existing_deck
        else:
            # Create system deck
            deck = FlashcardDeck(
                user_id=None,  # System deck - no owner
                language_id=language.id,
                name="Greetings",
                description="Common Kinyarwanda greetings and phrases",
                is_system=True,
                card_count=0
            )
            db.add(deck)
            db.commit()
            db.refresh(deck)
            print(f"Created system deck: {deck.name}")
        
        # Sample flashcards - Greetings
        sample_cards = [
            {"front": "Murakoze", "back": "Thank you", "example": "Murakoze cyane - Thank you very much"},
            {"front": "Muraho", "back": "Hello", "example": "Muraho neza? - How are you?"},
            {"front": "Amakuru", "back": "News", "example": "Amakuru meza? - Any news?"},
            {"front": "Ni meza", "back": "It's good", "example": "Ni meza - It's good"},
            {"front": "Mwiriwe", "back": "Good morning", "example": "Mwiriwe abafite ibitabo - Good morning to those with books"},
            {"front": "Bwakeye", "back": "Good evening", "example": "Bwakeye - Good evening"},
            {"front": "Urakomeye", "back": "Good job", "example": "Urakomeye - Good job/Well done"},
            {"front": "Ndagukunda", "back": "I love you", "example": "Ndagukunda cyane - I love you very much"},
            {"front": "Murabeho", "back": "Goodbye", "example": "Murabeho - Goodbye (to one staying)"},
            {"front": "Wa mbe", "back": "Goodbye", "example": "Wa mbe - Goodbye (to one leaving)"},
            {"front": "Nigufi", "back": "See you later", "example": "Nigufi - See you later"},
            {"front": "Bose", "back": "Everyone/All", "example": "Bose nibagenzi - Everyone is welcome"},
            {"front": "U Rwanda", "back": "Welcome", "example": "U Rwanda - Welcome (to Rwanda)"},
            {"front": "Ibyo ni akahe", "back": "How much?", "example": "Ibyo ni akahe? - How much is this?"},
            {"front": "Ndakwinginze", "back": "Please", "example": "Ndakwinginze - Please"},
            {"front": "Ubusabe", "back": "Excuse me", "example": "Ubusabe - Excuse me/Sorry"},
            {"front": "Ndashboard", "back": "Sorry", "example": "Ndashboard - I'm sorry"},
            {"front": "Mugabo", "back": "Sir/Mr", "example": "Mugabo - Sir/Mr"},
            {"front": "Madamu", "back": "Ma'am/Ms", "example": "Madamu - Ma'am/Ms"},
            {"front": "Mwishywa", "back": "Friend", "example": "Mwishywa wanjye - My friend"},
            {"front": "Umwana", "back": "Child", "example": "Umwana mucyo - Good child"},
            {"front": "Mubyeyi", "back": "Parent", "example": "Mubyeyi - Parent"},
            {"front": "Umugabo", "back": "Man", "example": "Umugabo - Man/Male"},
            {"front": "Umugore", "back": "Woman", "example": "Umugore - Woman/Female"},
        ]
        
        # Add cards if they don't exist
        existing_fronts = set()
        if deck.id:
            existing_cards = db.query(Flashcard).filter(Flashcard.deck_id == deck.id).all()
            existing_fronts = {c.front_text for c in existing_cards}
        
        cards_added = 0
        for card_data in sample_cards:
            if card_data["front"] not in existing_fronts:
                card = Flashcard(
                    deck_id=deck.id,
                    front_text=card_data["front"],
                    back_text=card_data["back"],
                    example_sentence=card_data["example"]
                )
                db.add(card)
                cards_added += 1
        
        if cards_added > 0:
            deck.card_count += cards_added
            db.commit()
            print(f"Added {cards_added} flashcards to deck '{deck.name}'")
        else:
            print(f"All {len(sample_cards)} cards already exist in deck '{deck.name}'")
        
        # Print deck stats
        total_cards = db.query(Flashcard).filter(Flashcard.deck_id == deck.id).count()
        print(f"\nDeck '{deck.name}' now has {total_cards} cards")
        
        # Also create a "Numbers" deck
        numbers_deck = db.query(FlashcardDeck).filter(
            FlashcardDeck.is_system == True,
            FlashcardDeck.name == "Numbers"
        ).first()
        
        if not numbers_deck:
            numbers_deck = FlashcardDeck(
                user_id=None,
                language_id=language.id,
                name="Numbers",
                description="Kinyarwanda numbers 1-20",
                is_system=True,
                card_count=0
            )
            db.add(numbers_deck)
            db.commit()
            db.refresh(numbers_deck)
            
            # Numbers cards
            numbers = [
                ("Kimwe", "One"),
                ("Kabiri", "Two"),
                ("Gatatu", "Three"),
                ("Kane", "Four"),
                ("Gatanu", "Five"),
                ("Gatandatu", "Six"),
                ("Gatunani", "Seven"),
                ("Umunaniro", "Eight"),
                ("Icyenda", "Nine"),
                ("Icumi", "Ten"),
                ("Icumimwe", "Eleven"),
                ("Icumibir", "Twelve"),
                ("Icumigatu", "Thirteen"),
                ("Icumikane", "Fourteen"),
                ("Icumigatanu", "Fifteen"),
                ("Icumigatandatu", "Sixteen"),
                ("Icumigatunani", "Seventeen"),
                ("Icumimunaniro", "Eighteen"),
                ("Icumicyenda", "Nineteen"),
                ("Icumicumi", "Twenty"),
            ]
            
            for num in numbers:
                card = Flashcard(
                    deck_id=numbers_deck.id,
                    front_text=num[0],
                    back_text=num[1]
                )
                db.add(card)
            
            numbers_deck.card_count = len(numbers)
            db.commit()
            print(f"Created deck '{numbers_deck.name}' with {len(numbers)} cards")
        
        print("\n✅ Seed completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_flashcards()

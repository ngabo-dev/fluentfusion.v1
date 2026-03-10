#!/usr/bin/env python3
"""
Instructor API Test Script
Tests all instructor endpoints in sequence
"""
import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/v1"

class InstructorAPITester:
    def __init__(self):
        self.token = None
        self.user_id = None
        self.instructor_id = None
        
    def print_result(self, test_name, response):
        print(f"\n{'='*60}")
        print(f"TEST: {test_name}")
        print(f"{'='*60}")
        print(f"Status: {response.status_code}")
        try:
            data = response.json()
            print(json.dumps(data, indent=2))
        except:
            print(response.text[:500])
        return response
    
    def test_registration(self):
        """Test instructor registration"""
        print("\n>>> TEST 1: Instructor Registration")
        import time
        payload = {
            "email": f"instructor{int(time.time()) % 10000}@test.com",
            "password": "TestPass123!",
            "full_name": "Test Instructor",
            "role": "instructor"
        }
        r = requests.post(f"{BASE_URL}/auth/register", json=payload)
        self.print_result("Registration", r)
        # Save email for login test
        self.test_email = payload["email"]
        self.test_password = payload["password"]
        return r.status_code in [200, 201, 400]  # 400 if already exists
    
    def test_login(self):
        """Test instructor login"""
        print("\n>>> TEST 2: Instructor Login")
        # Use the credentials from registration
        payload = {
            "email": getattr(self, 'test_email', 'testinstructor@fluentfusion.com'),
            "password": getattr(self, 'test_password', 'TestPass123!')
        }
        r = requests.post(f"{BASE_URL}/auth/login", json=payload)
        self.print_result("Login", r)
        if r.status_code == 200:
            data = r.json()
            self.token = data.get("access_token")
            self.user_id = data.get("user", {}).get("id")
            print(f"\n>>> Token received: {self.token[:50]}...")
        return r.status_code == 200
    
    def test_dashboard(self):
        """Test instructor dashboard"""
        print("\n>>> TEST 3: Instructor Dashboard")
        headers = {"Authorization": f"Bearer {self.token}"}
        r = requests.get(f"{BASE_URL}/instructor/dashboard", headers=headers)
        self.print_result("Dashboard", r)
        return r.status_code == 200
    
    def test_profile(self):
        """Test instructor profile"""
        print("\n>>> TEST 4: Instructor Profile")
        headers = {"Authorization": f"Bearer {self.token}"}
        r = requests.get(f"{BASE_URL}/instructor/profile", headers=headers)
        self.print_result("Get Profile", r)
        
        # Test update profile
        print("\n>>> TEST 4b: Update Profile")
        payload = {
            "headline": "Expert Language Instructor",
            "bio": "I have 10+ years of experience teaching languages",
            "website_url": "https://example.com"
        }
        r = requests.put(f"{BASE_URL}/instructor/profile", json=payload, headers=headers)
        self.print_result("Update Profile", r)
        return r.status_code == 200
    
    def test_my_courses(self):
        """Test get instructor courses"""
        print("\n>>> TEST 5: Get My Courses")
        headers = {"Authorization": f"Bearer {self.token}"}
        r = requests.get(f"{BASE_URL}/courses/instructor/my-courses", headers=headers)
        self.print_result("My Courses", r)
        return r.status_code == 200
    
    def test_create_course(self):
        """Test create course"""
        print("\n>>> TEST 6: Create Course")
        headers = {"Authorization": f"Bearer {self.token}"}
        payload = {
            "title": "Spanish for Beginners",
            "description": "Learn Spanish from scratch",
            "language_id": 2,
            "level": "beginner",
            "goal": "conversation",
            "price_usd": 29.99,
            "is_free": False
        }
        r = requests.post(f"{BASE_URL}/courses", json=payload, headers=headers)
        self.print_result("Create Course", r)
        if r.status_code == 200:
            data = r.json()
            self.course_id = data.get("course_id")
        return r.status_code in [200, 201]
    
    def test_students(self):
        """Test get students"""
        print("\n>>> TEST 7: Get Students")
        headers = {"Authorization": f"Bearer {self.token}"}
        r = requests.get(f"{BASE_URL}/instructor/students", headers=headers)
        self.print_result("Get Students", r)
        return r.status_code == 200
    
    def test_announcements(self):
        """Test announcements"""
        print("\n>>> TEST 8: Get Announcements")
        headers = {"Authorization": f"Bearer {self.token}"}
        r = requests.get(f"{BASE_URL}/instructor/announcements", headers=headers)
        self.print_result("Get Announcements", r)
        return r.status_code == 200
    
    def test_assignments(self):
        """Test assignments"""
        print("\n>>> TEST 9: Get Assignments")
        headers = {"Authorization": f"Bearer {self.token}"}
        r = requests.get(f"{BASE_URL}/instructor/assignments", headers=headers)
        self.print_result("Get Assignments", r)
        return r.status_code == 200
    
    def test_messages(self):
        """Test messages"""
        print("\n>>> TEST 10: Get Conversations")
        headers = {"Authorization": f"Bearer {self.token}"}
        r = requests.get(f"{BASE_URL}/instructor/conversations", headers=headers)
        self.print_result("Get Conversations", r)
        return r.status_code == 200
    
    def test_certificates(self):
        """Test certificates"""
        print("\n>>> TEST 11: Get Certificates")
        headers = {"Authorization": f"Bearer {self.token}"}
        r = requests.get(f"{BASE_URL}/instructor/certificates", headers=headers)
        self.print_result("Get Certificates", r)
        return r.status_code == 200
    
    def test_live_sessions(self):
        """Test live sessions"""
        print("\n>>> TEST 12: Get My Live Sessions")
        headers = {"Authorization": f"Bearer {self.token}"}
        r = requests.get(f"{BASE_URL}/live/instructor/sessions", headers=headers)
        self.print_result("Get My Live Sessions", r)
        return r.status_code == 200
    
    def test_earnings(self):
        """Test earnings"""
        print("\n>>> TEST 13: Get Earnings")
        headers = {"Authorization": f"Bearer {self.token}"}
        r = requests.get(f"{BASE_URL}/instructor/earnings", headers=headers)
        self.print_result("Get Earnings", r)
        return r.status_code == 200
    
    def test_user_me(self):
        """Test /users/me endpoint"""
        print("\n>>> TEST 14: Get /users/me")
        headers = {"Authorization": f"Bearer {self.token}"}
        r = requests.get(f"{BASE_URL}/users/me", headers=headers)
        self.print_result("Get /users/me", r)
        return r.status_code == 200

def main():
    tester = InstructorAPITester()
    
    # Run tests in sequence
    tests = [
        ("Registration", tester.test_registration),
        ("Login", tester.test_login),
        ("Dashboard", tester.test_dashboard),
        ("Profile", tester.test_profile),
        ("My Courses", tester.test_my_courses),
        ("Create Course", tester.test_create_course),
        ("Students", tester.test_students),
        ("Announcements", tester.test_announcements),
        ("Assignments", tester.test_assignments),
        ("Messages", tester.test_messages),
        ("Certificates", tester.test_certificates),
        ("Live Sessions", tester.test_live_sessions),
        ("Earnings", tester.test_earnings),
        ("/users/me", tester.test_user_me),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            success = test_func()
            results.append((name, "PASS" if success else "FAIL"))
        except Exception as e:
            print(f"\n>>> ERROR in {name}: {e}")
            results.append((name, "ERROR"))
    
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    for name, status in results:
        print(f"{name}: {status}")

if __name__ == "__main__":
    main()

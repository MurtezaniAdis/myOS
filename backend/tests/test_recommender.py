import unittest

from services.recommender import recommend_distros


class RecommenderTests(unittest.TestCase):
    def test_returns_closest_distros_when_all_scores_are_zero(self):
        answers = {
            "popularity": ["Absolutely"],
            "price": ["Yes"],
            "experience": ["Beginner"],
            "gui": ["Yes"],
            "hardware": ["Old"],
            "use_case": ["Security"],
            "weight": ["Yes"],
            "livetest": ["Yes"],
            "update_frequency": ["Rolling Release"],
            "design": ["Classic (like Windows)"],
            "philosophy": ["Open Source only"],
            "system_base": ["Arch based"],
        }
        distros = [
            {
                "id": index,
                "name": f"Distro {index}",
                "category": "Server",
                "price": "Paid",
                "popularity": "999",
                "image_size": "5000",
                "based_on": "Debian",
                "beginner_friendly": False,
                "rolling_release": False,
                "classic_design": False,
                "proprietary_friendly": True,
            }
            for index in range(1, 4)
        ]

        results = recommend_distros(answers, distros)

        self.assertEqual(len(results), 3)
        self.assertTrue(all(result["match_score"] == 0 for result in results))

    def test_rolling_release_answer_matches_quiz_option(self):
        distro = {
            "id": 1,
            "name": "Rolling Distro",
            "category": "Desktop",
            "price": "Free",
            "image_size": "1000",
            "based_on": "Arch",
            "rolling_release": True,
        }

        results = recommend_distros({"update_frequency": ["Rolling Release"]}, [distro])

        self.assertEqual(results[0]["match_percent"], 10)


if __name__ == "__main__":
    unittest.main()

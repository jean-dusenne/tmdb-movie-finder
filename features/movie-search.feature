Feature: Movie search
  As a movie finder user
  I want to search for a movie
  So that I can open its details

  Scenario: Open a movie from search suggestions
    Given the movie finder is open
    When I search for "Inception"
    Then I should see "Inception" in the search suggestions
    When I select the "Inception" search suggestion
    Then I should be on the movie details page for "Inception"
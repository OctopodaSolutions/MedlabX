Feature: Login Functionality

  Scenario: User logs in with valid credentials
    Given I log in with valid credentials
    Then I should be redirected to the dashboard
    # And I click on card to redirect to the MCA page
    And I click on avatar to open the menu and logout


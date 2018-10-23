# Project: Kattenkwaad

A simple website that allows you to find cat sitters, and filter them on your area and the maximum price you are willing to pay per hour. Made for BSSA. 

## General Information

Going on a holiday? Don’t want to leave your cats alone? Don’t have neighbours who you’d trust with your lovely feline? Often the next step is visiting a ‘holiday shelter’, where they take care of your feline companion for you. However, after a visit to one of these shelters I decided I’d rather cancel my holiday than leave my cat there. Often a number of cats share a small space, and the constant meowing (and barking of the dog shelter next door) didn’t give me the feeling that my cats would be happy there. Hence, I embarked on a internet search for a cat sitter. Most catsitters have their own site, which made comparing them difficult. This is where my website comes in handy: simply make an account, view the cat-sitters who have registered, and send them an email if you’re interested! Target audience: Cat-sitters and cat owners.Specific goal: Make it easy to find a cat-sitter - no need to compare individual cat-sitter sites anymore, simply compare the profiles and contact a cat-sitter! 

### Business Information
Possible source of revenue: ads for cat-related products

Costs: server, domain-name

### Market informa tion
Competition: There are comparable website available that are like a Treatwell for cat-sitting. 

What makes my product unique: Cat sitters have to pay about 20% of their earned cat-sitting fee to my competitors. Mine is free - I simply want to make it easier to find a cat-sitter. 

What is the current supply / demand for your product: It depends - there is a large supply of ‘free lance’ cat-sitters, less so of ‘professional’ ones - who have had some training (my cat sitter, for example, is a vet assistant, which is quite handy since one of my cats has epilepsy). 

### Getting Started
Clone project, npm install, add environment variables (dotenv). 

### Timeline
_01/10/2018_
- Made plan for general function of the website and basic layout. 

_01/12/2017_
- Setting up the basic structure
    - Server routes
    - Database models
    - EJS pages (home, about, profile)
    - CSS


_02/10/2018_
- Added profile pic functionality
- Finalised sign up page

_11/10/2018_
- Added a location filter

19/10/2018_
- Dropdown Login functionality added

_22/10/2018_
- Added jQuery price filter



### Technical Specifications:

- Display cat sitters profiles to browse. 
- Filter options for area and price. 
    - Cat-owners and cat-sitters have to fill in their location, and cat-sitters the distance they are willing to travel. When      users go to this page, a distance API is usedto calculate the distance between their respective locations. If the distance is smaller than the distance the cat-sitter is willing to travel, the profile is shown.
    - jQuery for price filtering. 


### Built with/Languages/Libraries
- Node.js
- JavaScript
- PostgreSQL
- Bootstrap
- Sequelize, SequelizeSotre
- EJS
- Request
- Express, Session, fileUpload

### Future to do’s

- Option to edit profile
- Add option for entering whether cat-sitter has professional certifications and filtering based on yes/no. 
- Extend filtering functions (f.e. a main filter and then with each added filter a narrowed down list will be passed down that will be displayed.
- Direct booking system

## Authors

Samuel Mulkens

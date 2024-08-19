# Database FireStore - Firebase

## Description

1. users: collection of users
  - id_user: document id
    - id_user: string
    - name: string
    - email: string
    - photoURL: string

    - provider: string (google, facebook, email)
    - createdAt: timestamp
    - updatedAt: timestamp

2. authentification: collection of authentification
  - id_user: document id
    - id_user: string
    - email: string
    - password: string

3. folders: 
  - id_folder: document id
    - id_folder: string
    - id_user: string
    - name: string
    - nums_word_set: number
    - createdAt: timestamp
    - modifiedAt: timestamp

4. WordSets: 
  - id_word_set: document id
    - id_word_set: string
    - id_folder: string
    - name: string
    - visibility: 'public' | 'private'
    - createdAt: timestamp
    - nums_word: number
    - words: [
      - word: string
      - meaning: string
      - context: [
        - context: string
        - translation: string
      ]
      - createdAt: timestamp
    ]


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


3. folders: collection of folders
  - id_folder: document id
    - id_folder: string
    - id_user: string
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

4. words: collection of word
    - word: document id
      - word: string
      - meanings: [
        - meaning: string
        - point: number
      ]
      - contexts: [
        - context: string
        - translation: string
        - point: number
      ]


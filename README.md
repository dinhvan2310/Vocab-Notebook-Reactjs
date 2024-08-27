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


<!-- 2. authentification: collection of authentification
  - id_user: document id
    - id_user: string
    - email: string
    - password: string -->

3. folders: 
  - id_folder: document id
    - id_folder?: string
    - id_user: string

    - name: string
    - name_lowercase: string
    - createdAt: timestamp
    - modifiedAt: timestamp

    <!-- - word_sets: [
      ref(WordSets)
    ] -->


4. WordSets: 
  - id_word_set: document id
    - id_word_set: string
    - id_folder: string
    - name: string
    - visibility: 'public' | 'private'
    - image_url: string

    - createdAt: timestamp
    - modifiedAt: timestamp

    - words: [
      - name: string
      - meaning: ref(Meaning)
      - context: [
        - context: ref(Context)
      ]
    ]

5. Words: 
  - name: document id
    - name: string
    - meanings: [
      - meaning: string
      - point: number
    ]
    - contexts: [
      - context: string
      - translation: string
      - point: number
    ]

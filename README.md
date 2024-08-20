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

    - folders: [
      ref(folders)
    ]

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

    - word_sets: [
      ref(WordSets)
    ]


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





4.1 Giao diện người dùng
4.1.1 
4.1.2 
4.1.3 
4.2 
4.2.1 
4.2.2 
4.3 Giao diện phần mềm
4.3.1 Trang web phải tích hợp với một cổng thanh toán an toàn để xử lý việc ghi danh khóa học và thanh toán.
4.3.2 Trang web phải tích hợp với một hệ thống quản lý quan hệ khách hàng (CRM) để quản lý tài khoản người dùng và dữ liệu học viên.
4.3.3 Trang web phải tích hợp với một hệ thống quản lý học tập (LMS) để cung cấp nội dung khóa học và theo dõi tiến độ của học viên.
Các yêu cầu phi chức năng khác
5.1 Yêu cầu về hiệu suất
5.1.1 
5.1.2 Hệ thống phải có khả năng xử lý tối thiểu 1.000 người dùng đồng thời mà không suy giảm hiệu suất đáng kể.
5.2 Yêu cầu bảo mật
5.2.1 Trang web phải sử dụng giao thức HTTPS để mã hóa tất cả dữ liệu và giao tiếp của người dùng.
5.2.2 Hệ thống phải thực hiện kiểm soát truy cập dựa trên vai trò để đảm bảo rằng chỉ có người dùng được ủy quyền mới có thể truy cập và thực hiện các hành động cụ thể.
5.2.3 Hệ thống phải có các cơ chế để phát hiện và ngăn chặn các cuộc tấn công web phổ biến, chẳng hạn như注入SQL và cross-site scripting (XSS).
5.3 Yêu cầu tin cậy
5.3.1 Trang web phải có thời gian hoạt động ít nhất 99,9% trong giờ làm việc bình thường.
5.3.2 
5.4 Khả năng bảo trì và mở rộng
5.4.1 Trang web phải được thiết kế với kiến trúc modular để hỗ trợ các bản cập nhật và bổ sung tính năng trong tương lai.
5.4.2 Mã nguồn phải tuân theo các thực hành và hướng dẫn tài liệu tiêu chuẩn của ngành để đảm bảo khả năng bảo trì bởi đội ngũ phát triển.
5.4.3 Hệ thống phải cung cấp giao diện quản trị để cho phép tổ chức quản lý các khóa học, tài khoản người dùng và các cấu hình khác liên quan đến trang web.
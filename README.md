# :movie_camera: 졸업작품: OTT 웹 애플리케이션 :tv:
![Logo](/frontend/public/logo.png)
- 졸업작품으로 제출한 OTT 웹 애플리케이션입니다. 
- 백엔드는 Ruby on Rails로 작성하였고, 프론트엔드는 Next.js로 작성했습니다.
- 동영상 스트리밍의 기술인 Adaptive Bitrate Streaming을 구현하기 위해서 MPEG-DASH(Dynamic Adaptive Streaming Over HTTP) 프로토콜을 사용했습니다.
- 웹 호스팅은 하지 않았고 프론트엔드의 디자인 부분은 시중에 있는 OTT 서비스들로부터 아이디어를 많이 얻었습니다. 
- 전부 처음 사용해보는 프레임워크였고, 첫 개인 프로젝트였기 때문에 미숙한 점들이 많습니다. 
- 백엔드에 있는 동영상 파일을 제외하고 모두 올렸습니다.
## 스크린샷
- 메인 페이지
![image](https://user-images.githubusercontent.com/101819709/223084459-3504768b-f6eb-44dc-92a9-a8339a03ccf9.png)
- 로그인 후 홈 화면
![image](https://user-images.githubusercontent.com/101819709/223087816-0743c5e5-3854-43c9-b500-743849764931.png)
- 티비 프로그램/영화 정보 화면
![image](https://user-images.githubusercontent.com/101819709/223088203-07b9a298-6a2a-4a36-b600-13a8d3bc0563.png)
- 동영상 로딩 화면
![image](https://user-images.githubusercontent.com/101819709/223088670-052da5f3-5566-4ed8-a02b-e4a78243d5fb.png)
- 동영상 플레이어 화면
![image](https://user-images.githubusercontent.com/101819709/223088539-cfeb3792-f137-458e-9b7f-ebc57564421b.png)
## 주요기능
-	시간제 멤버십
- 회원 정보 관리
  - 남은 시청 시간
  - 이어보기 기록\
    ![image](https://user-images.githubusercontent.com/101819709/223158937-8b7a68c7-940c-453c-9b82-daa3bb80232c.png)
  - 콘텐츠 평가 기록\
  ![image](https://user-images.githubusercontent.com/101819709/223159247-4c8498f4-c2ff-4560-b008-e1a4bcb6598c.png)
  - 콘텐츠 연령 제한
- 동영상 플레이어
  - 인터넷 속도를 감안한 자동 화질 변경 (MPEG-DASH 포맷의 영상을 재생)
  - 사용자의 이어보기 기록 반영
  - 오프닝, 크레딧 건너뛰기\
  ![image](https://user-images.githubusercontent.com/101819709/223161523-4c0fe0de-dd26-41e2-a32a-a40b2f706639.png)
  - 다음 화 재생 버튼\
  ![image](https://user-images.githubusercontent.com/101819709/223161399-2c8be999-b5d8-4d86-bf56-adaedecf07e1.png)
  - 회차 목록에서 재생할 회차 선택\
  ![image](https://user-images.githubusercontent.com/101819709/223161706-72f33a98-5a10-4e83-8652-259e69fe473e.png)
  - 자막\
  ![image](https://user-images.githubusercontent.com/101819709/223164785-61792b0c-b0ac-4b7c-b531-6ecb78063128.png)
  - 배속 재생\
  ![image](https://user-images.githubusercontent.com/101819709/223165265-8a6f91d9-9a79-48b4-9ef4-d6e7102e4a65.png)
  - 탐색 구간에서 썸네일 미리보기\
  ![image](https://user-images.githubusercontent.com/101819709/223189722-f15f76e8-ccf1-494f-b540-0acb2b2a9b9f.png)
-	비슷한 콘텐츠 보기
- 콘텐츠 검색\
![image](https://user-images.githubusercontent.com/101819709/223167319-17fb9083-ea4e-4ed2-8ca3-5aa67e80af2d.png)
-	콘텐츠 평가\
![image](https://user-images.githubusercontent.com/101819709/223159729-45fa32c9-80d0-4a20-b893-32b956016d4f.png)
-	쿠폰 사용\
![image](https://user-images.githubusercontent.com/101819709/223167497-4df3e87c-bbb9-431d-aeb6-b9c8d90a16ca.png)
## 웹사이트 플로우 차트
![web flow (1)](https://user-images.githubusercontent.com/101819709/223176419-1afeb888-d753-450d-8d01-6851b7fe4443.png)
## 개체 관계도
![image](https://user-images.githubusercontent.com/101819709/223184761-a08aaab0-94b6-404e-aee4-246f342e70eb.png)
## 사용된 기술
- Next.js 12.1.4
  - Libraries
    - React 18.0.0
    - Shaka Player 3.1.6 -> MPEG-DASH 포맷의 영상을 재생하는 플레이어
    - React Query 3.39.2 -> 백엔드 서버에 HTTP 요청
    - Axios 0.26.1
- Ruby on Rails 7.0.2.3
  - Ruby 2.7.5
  - Gems
    - Devise 4.8.1 -> 회원 관리 기능
    - Devise-JWT 0.9.0 -> Devise의 확장 Gem으로 회원 인증을 JWT(JSON Web Token)으로 할 수 있는 기능 제공
    - MiniMagick 4.11.0 -> 웹에서 찾은 이미지 파일을 백엔드에 저장
    - Streamio FFMPEG 3.0.2
- PostgreSQL 14.2
  - pgAdmin 4 (v6.4)
- Shaka Packager 2.6.1 -> 동영상 정보 기반으로 DASH 매니페스트 파일 생성
- FFmpeg 5.0  -> 동영상 파일을 DASH 포맷으로 인코딩
- Insomnia 2022.6.0 -> 백엔드 API 기능 테스트
- Visual Paradigm 16.3 -> E-R 다이어그램 작성

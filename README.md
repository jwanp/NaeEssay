# Nae Essay

에세이를 작성하고 공유하며 자동 채점을 받을 수 있는 웹사이트입니다.

## 개요

**학생들이 자신의 생각을 글로 표현하고 다양한 의견을 존중하며 토론할 수 있는 공간을 제공**

-   학원
-   학교
-   건전한 온라인 커뮤니티

```
사람들은 자신의 생각이나 일상을 공유하는 것을 즐거워합니다.  
따라서 흥미로운 주제를 중심으로 에세이를 공유할 수 있는 플랫폼이 있다면, 학생들이 더 즐겁게 에세이를 작성할 수 있을 것입니다.

학생들뿐만 아니라 성인들도 자신의 에세이를 공유할 수 있는 건전한 온라인 커뮤니티로 활용할 수 있습니다.
```
## 주요기능

### 1.주제 혹은 에세이를 북마크하거나 좋아요 기능으로 탐색 가능
**북마크 기능: 주제를 북마크하고 마이페이지에서 탐색할 수 있습니다.**

<img src="./docs/img/bookmark.gif" alt="bookmark" width="600"/>

**좋아요 기능: 에세이에 좋아요를 누르고 마이페이지에서 확인할 수 있습니다.**

<img src="./docs/img/like.gif" alt="like" width="600"/>

### 2. 에세이 작성 온라인 에디터 및 수정 삭제 기능

주제 페이지에서 글쓰기 버튼을 눌러서 에세이를 작성할 수 있고 수정 혹은 삭제가 가능합니다.

<img src="./docs/img/editor.gif" alt="editor" width="600"/>


### 3. 자신이 쓴 에세이들을 자동으로 채점하는 Automated Essay Scoring 기능 제공

마이페이지의 에세이 탭에서 에세이를 자동으로 채점할 수 있습니다.

<img src="./docs/img/AES.gif" alt="AES" width="600"/>

### 4. 에세이 댓글 및 수정 삭제 기능

<img src="./docs/img/comment.gif" alt="comment" width="600"/>

## 시스템 구성도

![image.png](./docs/img/시스템구성도.png)

**Frontend**

```
-   Tailwind CSS
-   NextAuth
-   ReactQuery
-   Typescript
-   Lexical Editor
```

**Backend**

```
-   Nextjs pages API
-   MongoDB Adapter
-   NextAuth
```

**AI**

```
-   FastAPI
-   Huggingface Transformer
```

**DB**

```
-   MongoDB
```

**Version Control**

```
-   Git, Github
```

## 재작 기간

**2024.09.02. - 2024.11.20**

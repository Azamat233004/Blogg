let posts = JSON.parse(localStorage.getItem("posts")) || [];

function renderPosts() {
    const list = document.getElementById("post-list");
    const counter = document.getElementById("post-counter");
    const search = document.getElementById("search").value.toLowerCase();

    list.innerHTML = "";

    let filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(search) ||
            post.content.toLowerCase().includes(search)
    );

    counter.textContent = `Всего постов: ${filteredPosts.length}`;

    filteredPosts.forEach((post, index) => {
        const div = document.createElement("div");
        div.className = "post";

        div.innerHTML = `
            <p class="date">${post.date}</p>
            <p class="topic">${post.topic}</p>
            <p class="title">${post.title}</p>
            <p class="content">${post.content}</p>
            ${
                post.media && post.media.length > 0
                    ? post.media
                          .map((item) =>
                              item.type === "image"
                                  ? `<img src="${item.url}" />`
                                  : item.type === "video"
                                  ? `<video controls src="${item.url}"></video>`
                                  : ""
                          )
                          .join("")
                    : ""
            }
            <div class="actions">
                <span class="like-btn" onclick="toggleLike(${index})">
                    ${post.liked ? "❤" : "🤍"} ${post.likes}
                </span>
                <button class="delete-btn" onclick="deletePost(${index})">Удалить</button>
            </div>
        `;

        list.prepend(div);
    });
}


function publishPost() {
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const topic = document.getElementById("topic").value.trim();
    const files = document.getElementById("images").files;

    if (!title || !content || !topic) {
        alert("Пожалуйста, заполните заголовок, тему и текст поста.");
        return;
    }

    let media = [];
    for (let file of files) {
        const url = URL.createObjectURL(file);
        media.push({
            type: file.type.startsWith("video/") ? "video" : "image",
            url,
        });
    }

    const newPost = {
        title,
        content,
        topic,
        media,
        date: new Date().toLocaleString("ru-RU"),
        likes: 0,
        liked: false,
    };

    posts.push(newPost);
    savePosts();
    clearInputs();
    renderPosts();
}

function toggleLike(index) {
    posts[index].liked = !posts[index].liked;
    posts[index].likes += posts[index].liked ? 1 : -1;
    savePosts();
    renderPosts();
}

function deletePost(index) {
    if (index >= 0 && index < posts.length) {
        if (confirm("Вы уверены, что хотите удалить этот пост?")) {
            posts.splice(index, 1);
            savePosts();
            renderPosts();
        }
    }
}

function clearPosts() {
    if (confirm("Вы уверены, что хотите удалить все посты?")) {
        posts = [];
        savePosts();
        renderPosts();
    }
}

function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
}

function clearInputs() {
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    document.getElementById("topic").value = "";
    document.getElementById("images").value = ""; // Очищаем поле для файлов
}

document.getElementById("search").addEventListener("input", renderPosts);

window.addEventListener("load", renderPosts);

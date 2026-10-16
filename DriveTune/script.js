
const moodButtons = document.querySelectorAll(".mood-card");
const selectedMood = document.getElementById("selectedMood");

const voiceButton = document.getElementById("voiceButton");
const statusText = document.getElementById("status");
const recognizedText = document.getElementById("recognizedText");

const playlistLink = document.getElementById("playlistLink");
const playlistMessage = document.getElementById("playlistMessage");

// 気分ごとのYouTube Musicプレイリスト
const playlists = {
    "エモい":
        "https://music.youtube.com/playlist?list=PLtPwVD5lDz00x7jeVZ4fGDS_E-2lEYMFO&si=lfVPepwGYs5pDyyp",

    "爽快":
        "https://music.youtube.com/playlist?list=PLtPwVD5lDz00rXGfDDamQwLK6QHFDIssP&si=mbfTD3OItiARJNjo",

    "落ち着く":
        "https://music.youtube.com/playlist?list=PLtPwVD5lDz03mOQQ-bIRnJ3UWzYVxejv8&si=VPY8QomABXFiVgyO",

    "幻想的":
        "https://music.youtube.com/playlist?list=PLtPwVD5lDz00JkjB87WIT1aE-7df1lTba&si=0BWiSqS1v-7B8fMS"
};

// 気分を選択してプレイリストを表示する
function selectMood(mood) {
    moodButtons.forEach((button) => {
        button.classList.remove("selected");
    });

    const targetButton = [...moodButtons].find(
        (button) => button.dataset.mood === mood
    );

    if (!targetButton || !playlists[mood]) {
        return;
    }

    targetButton.classList.add("selected");
    selectedMood.textContent = `選択中の気分：${mood}`;

    // 選んだ気分に対応するURLを設定
    playlistLink.href = playlists[mood];
    playlistLink.hidden = false;

    playlistMessage.textContent =
        `「${mood}」のプレイリストを選択しました。`;
}

// 気分カードをクリックしたときの処理
moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectMood(button.dataset.mood);
    });
});

// 音声認識機能
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    statusText.textContent =
        "このブラウザーでは音声認識を利用できません。";
    voiceButton.disabled = true;
} else {
    const recognition = new SpeechRecognition();

    recognition.lang = "ja-JP";
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceButton.addEventListener("click", () => {
        recognizedText.textContent = "";
        statusText.textContent = "聞き取り中です。話してください。";

        try {
            recognition.start();
        } catch (error) {
            statusText.textContent =
                "開始できませんでした。少し待ってから再度お試しください。";
        }
    });

    recognition.onresult = (event) => {
        const speech = event.results[0][0].transcript;

        recognizedText.textContent = `認識した言葉：${speech}`;
        statusText.textContent = "音声を認識しました。";

        if (speech.includes("エモ") || speech.includes("切ない")) {
            selectMood("エモい");
        } else if (
            speech.includes("爽快") ||
            speech.includes("明るい") ||
            speech.includes("盛り上がる")
        ) {
            selectMood("爽快");
        } else if (
            speech.includes("落ち着") ||
            speech.includes("リラックス") ||
            speech.includes("穏やか")
        ) {
            selectMood("落ち着く");
        } else if (
            speech.includes("幻想的") ||
            speech.includes("神秘的") ||
            speech.includes("ミステリアス")
        ) {
            selectMood("幻想的");
        } else {
            statusText.textContent =
                "気分を判定できませんでした。別の言葉でお試しください。";
        }
    };

    recognition.onerror = (event) => {
        if (event.error === "not-allowed") {
            statusText.textContent =
                "マイクの使用が許可されていません。";
        } else {
            statusText.textContent =
                `音声認識エラー：${event.error}`;
        }
    };

    recognition.onstart = () => {
        voiceButton.disabled = true;
    };

    recognition.onend = () => {
        voiceButton.disabled = false;
    };
}

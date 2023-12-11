let exerciseCount = 0;
let exerciseStartTime = null;
function updateTime() {
    const currentTimeElement = document.getElementById('currentTime');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    currentTimeElement.textContent = `현재 시간: ${hours}:${minutes}:${seconds}`;
}

//운동시간을 알아내기 위함
function updateElapsedTime() {
    const elapsedTimeElement = document.getElementById('elapsedTime');
    if (exerciseStartTime) {
        const elapsedTime = new Date() - exerciseStartTime;
        const elapsedMinutes = Math.floor(elapsedTime / 60000);
        const elapsedSeconds = Math.floor((elapsedTime % 60000) / 1000);
        elapsedTimeElement.textContent = `운동 시간: ${elapsedMinutes}:${elapsedSeconds}`;
    } else {
        elapsedTimeElement.textContent = '운동 시간: 00:00';
    }
}

function incrementExerciseCount() {
    exerciseCount++;
    updateExerciseCount();
    updateExerciseBar();
}

function updateExerciseCount() {
    const exerciseCountElement = document.getElementById('exerciseCount');
    exerciseCountElement.textContent = `운동 횟수: ${exerciseCount}`;
}

function updateExerciseBar() {
    const exerciseBarFill = document.getElementById('exerciseBarFill');
    const maxWidth = document.getElementById('exerciseBar').offsetWidth;
    const fillWidth = (exerciseCount / 30) * maxWidth; // 최대 30개의 바까지

    if (exerciseCount <= 30) {
        exerciseBarFill.style.width = `${fillWidth}px`;
    } else {
        exerciseCount = 30; // 최대 개수를 초과하면 최대 개수로 고정
        exerciseBarFill.style.width = `${maxWidth}px`;
    }
}

function updateSelectedExercise() {
    const selectedExerciseElement = document.getElementById('selectedExercise');
    const exerciseSelector = document.getElementById('exerciseSelector');
    const selectedExercise = exerciseSelector.value;

    if (selectedExerciseElement.textContent !== selectedExercise) {
        exerciseCount = 0;
        exerciseStartTime = null;
        updateExerciseCount();
        updateExerciseBar();
        selectedExerciseElement.textContent = selectedExercise;
    }

    hideExerciseSelector();
}

function toggleExerciseSelector() {
    const exerciseSelectorContainer = document.getElementById('exerciseSelectorContainer');
    if (exerciseSelectorContainer.style.display === 'block') {
        hideExerciseSelector();
    } else {
        showExerciseSelector();
    }
}

function showExerciseSelector() {
    const exerciseSelectorContainer = document.getElementById('exerciseSelectorContainer');
    exerciseSelectorContainer.style.display = 'block';
}

function hideExerciseSelector() {
    const exerciseSelectorContainer = document.getElementById('exerciseSelectorContainer');
    exerciseSelectorContainer.style.display = 'none';
}

function startExercise() {
    if (!exerciseStartTime) {
        exerciseStartTime = new Date();
    }
    incrementExerciseCount();
}

function getCurrentDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고, 두 자릿수로 포맷팅
    const day = now.getDate().toString().padStart(2, '0'); // 두 자릿수로 포맷팅

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}


function sendExerciseData() {
    var userName = document.getElementById('userName').value;
    var selectedExercise = document.getElementById('selectedExercise').innerText;

    // 데이터가 비어있는지 확인
    if (!userName || !selectedExercise || isNaN(exerciseCount)) {
        alert('모든 필드를 입력하세요.');
        return;
    }

    console.log('userName:', userName);
    console.log('selectedExercise:', selectedExercise);
    console.log('exerciseCount:', exerciseCount);

    //날짜 
    const currentDate = getCurrentDate();


    //시간
    function calculateExerciseTime() {
        if (exerciseStartTime) {
            const elapsedTime = new Date() - exerciseStartTime;
            return Math.floor(elapsedTime / (1000 * 60)); // 분 단위로 운동 시간 계산
        }
        return 0; // 시작 시간이 없을 경우 0으로 설정
    }


    // 운동 데이터 객체 생성
    var exerciseData = {
        username: userName,
        exerciseCount: exerciseCount,
        exerciseTime: calculateExerciseTime(), // 예시 데이터에서 가져옴, 실제로는 적절한 값으로 설정
        exerciseDate: currentDate, 
        exerciseName: selectedExercise
    };

    // 서버에 데이터 전송
    fetch('내 도메인 주소로 할것/api/submit-exercise-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseData),
    })
    .then(response => {
        if (response.status === 204) {
            // 빈 응답이면 처리하지 않고 종료
            return;
        }
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    
        return response.json();
    })
    .then(data => {
        if (data) {
            console.log('Success:', data);
            // 성공했을 때의 동작을 추가하세요.
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        // 에러 발생 시의 동작을 추가하세요.
    });
}

setInterval(() => {
    updateTime();
    updateElapsedTime();
}, 1000);

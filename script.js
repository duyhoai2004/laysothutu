// Lấy các phần tử từ DOM
const invitationText = document.getElementById('invitation-text');
const randomNumberElementBocSo = document.getElementById('random-number-boc-so');
const buttonBocSo = document.getElementById('button-boc-so');
let currentNumberBocSo = 0;

const buttonDecrement = document.getElementById('button-decrement');

const randomNumberElementGoiSo = document.getElementById('random-number-goi-so');
const buttonGoiSo = document.getElementById('button-goi-so');
let currentNumberGoiSo = 0;

const buttonReset = document.getElementById('button-reset');
const buttonViewHistory = document.getElementById('button-view-history');
const historyContainer = document.getElementById('history-container');

const audioElement = document.getElementById('audio-element');
const audioElement1 = document.getElementById('audio-element1');

// Hàm để lấy ngày hiện tại dưới dạng chuỗi 'YYYY-MM-DD'
function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

// Hàm để kiểm tra và reset số nếu qua ngày mới
function checkAndResetNumber() {
    const currentDate = getCurrentDate();
    const lastDate = localStorage.getItem('lastDate');
    
    if (lastDate !== currentDate) {
        // Lưu số lượng số bốc của ngày trước
        const previousTotal = currentNumberBocSo;
        if (lastDate) {
            const history = JSON.parse(localStorage.getItem('bocSoHistory') || '[]');
            history.push({ date: lastDate, total: previousTotal });
            localStorage.setItem('bocSoHistory', JSON.stringify(history));
        }

        // Reset số bốc
        currentNumberBocSo = 0;
        currentNumberGoiSo = 0;
        localStorage.setItem('lastDate', currentDate);
    } else {
        // Khôi phục số bốc hiện tại từ localStorage
        currentNumberBocSo = parseInt(localStorage.getItem('currentNumberBocSo'), 10) || 0;
        currentNumberGoiSo = 0;
    }
}

// Gọi hàm kiểm tra khi tải trang
checkAndResetNumber();

// Cập nhật hiển thị khi tải trang
randomNumberElementBocSo.textContent = currentNumberBocSo;
randomNumberElementGoiSo.textContent = currentNumberGoiSo;

// Xử lý sự kiện bấm nút bốc số
buttonBocSo.addEventListener('click', function() {
    currentNumberBocSo++;
    randomNumberElementBocSo.textContent = currentNumberBocSo;
    invitationText.textContent = `SỐ THỨ TỰ CỦA BẠN LÀ: ${currentNumberBocSo}`;
    
    console.log('Inserting into boc_so table:', currentNumberBocSo);
    
    // Lưu số bốc hiện tại vào localStorage
    localStorage.setItem('currentNumberBocSo', currentNumberBocSo);
});

// Xử lý sự kiện bấm nút gọi số
buttonGoiSo.addEventListener('click', function() {
    if (currentNumberGoiSo < currentNumberBocSo) {
        currentNumberGoiSo++;
        randomNumberElementGoiSo.textContent = currentNumberGoiSo;
        invitationText.textContent = `MỜI SỐ THỨ TỰ ${currentNumberGoiSo}`;

        const speech = new SpeechSynthesisUtterance(`MỜI SỐ THỨ TỰ ${currentNumberGoiSo}`);
        speech.lang = 'vi-VN';

        speech.volume = 100;
        speech.rate = 1.2;
        speech.pitch = 200;

        speech.onend = function(event) {
            console.log('Đọc xong số:', event.utterance.text);
            audioElement.play();
        };

        window.speechSynthesis.speak(speech);
    } else {
        alert('KHÔNG THỂ GỌI SỐ LỚN HƠN SỐ ĐÃ BỐC.');
    }
});


// Xử lý sự kiện bấm nút giảm số
buttonDecrement.addEventListener('click', function() {
    if (currentNumberBocSo > 0) {
        currentNumberBocSo--;
        randomNumberElementBocSo.textContent = currentNumberBocSo;
        invitationText.textContent = `SỐ THỨ TỰ CỦA BẠN LÀ: ${currentNumberBocSo}`;
        
        // Lưu số bốc hiện tại vào localStorage
        localStorage.setItem('currentNumberBocSo', currentNumberBocSo);
    } else {
        alert('Số bốc không thể nhỏ hơn 0.');
    }
});

// Xử lý sự kiện nhấn phím
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        currentNumberBocSo++;
        randomNumberElementBocSo.textContent = currentNumberBocSo;
        invitationText.textContent = `SỐ THỨ TỰ CỦA BẠN LÀ: ${currentNumberBocSo}`;
        
        // Lưu số bốc hiện tại vào localStorage
        localStorage.setItem('currentNumberBocSo', currentNumberBocSo);
    } else if (event.key === ' ') {
        if (currentNumberGoiSo < currentNumberBocSo) {
            currentNumberGoiSo++;
            randomNumberElementGoiSo.textContent = currentNumberGoiSo;
            invitationText.textContent = `MỜI SỐ THỨ TỰ ${currentNumberGoiSo}`;

            const speech = new SpeechSynthesisUtterance(`MỜI SỐ THỨ TỰ ${currentNumberGoiSo}`);
            speech.lang = 'vi-VN';

            speech.volume = 100;
            speech.rate = 1.2;
            speech.pitch = 1;

            speech.onend = function(event) {
                console.log('Đọc xong số:', event.utterance.text);
                audioElement.play();
            };

            window.speechSynthesis.speak(speech);
        } else {
            alert('Không thể gọi số lớn hơn số đã bốc.');
        }
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'Shift') {
        audioElement1.play();
    }
});

// Xử lý sự kiện bấm nút reset
buttonReset.addEventListener('click', function() {
    // Lưu số lượng số bốc của ngày hiện tại trước khi reset
    const currentDate = getCurrentDate();
    const previousTotal = currentNumberBocSo;
    const history = JSON.parse(localStorage.getItem('bocSoHistory') || '[]');
    history.push({ date: currentDate, total: previousTotal });
    localStorage.setItem('bocSoHistory', JSON.stringify(history));

    // Reset số bốc
    currentNumberBocSo = 0;
    currentNumberGoiSo = 0;
    randomNumberElementBocSo.textContent = currentNumberBocSo;
    randomNumberElementGoiSo.textContent = currentNumberGoiSo;
    invitationText.textContent = `SỐ THỨ TỰ CỦA BẠN LÀ: ${currentNumberBocSo}`;
    
    // Lưu ngày hiện tại và số bốc hiện tại vào localStorage
    localStorage.setItem('lastDate', currentDate);
    localStorage.setItem('currentNumberBocSo', currentNumberBocSo);
});

//Xem lịch sử
buttonViewHistory.addEventListener('click', function() {
    const history = JSON.parse(localStorage.getItem('bocSoHistory') || '[]');
    historyContainer.innerHTML = '';

    if (historyContainer.style.display === 'block') {
        // Nếu danh sách đang hiển thị, ẩn nó đi
        historyContainer.style.display = 'none';
    } else {
        // Nếu danh sách đang ẩn, hiển thị nó và cập nhật nội dung
        if (history.length === 0) {
            historyContainer.innerHTML = '<p>Không có lịch sử bốc số.</p>';
        } else {
            history.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.textContent = `Ngày: ${item.date}, Tổng số bốc: ${item.total}`;
                historyContainer.appendChild(historyItem);
            });
        }

        historyContainer.style.display = 'block';
    }
});
;

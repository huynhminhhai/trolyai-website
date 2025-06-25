function typeEffect(element, speed) {
    let text = element.text();
    element.text(''); // Clear the text
    let i = 0;

    function type() {
        if (i < text.length) {
            element.text(element.text() + text.charAt(i));
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

const convertSpacesToEncoded = (text) => {
    return text.replace(/ /g, '%20');
};

$(document).ready(function () {

    $(window).on("load", function () {
        const $overlay = $(".loader");
        $overlay.css({
            "transition": "opacity 0.5s ease",
            "opacity": "0"
        });

        setTimeout(() => {
            $overlay.css("display", "none");
        }, 500);
    });

    $(".media-card").each(function () {
        const $card = $(this);
        const $video = $card.find("video").get(0);

        $card.on("mouseenter", function () {
            $video.play();
        });

        $card.on("mouseleave", function () {
            $video.pause();
            $video.currentTime = 0;
        });
    });

    $("#toggleOptions").on("click", function () {
        $("#extraOptions").slideToggle("fast", function () {
            const isVisible = $(this).is(":visible");
            $("#toggleOptions").text(isVisible ? "- Ẩn bớt tùy chọn" : "+ Thêm tùy chọn");
        });
    });

    $(".createBtn").on("click", function (e) {
        e.preventDefault();

        $('.responseMessage').fadeOut(300);
        $('.responseContent').fadeOut(300);
        // Hiện loading
        $('.loadingContent').fadeIn(200);

        // Sau 500ms thì ẩn loading, hiện nội dung
        setTimeout(() => {
            $('.loadingContent').fadeOut(200, function () {
                // Sau khi loading ẩn xong thì hiện nội dung
                $('.responseContent').fadeIn(300);
            });
        }, 1500);
    });

    const $btn = $("#btnMore");
    const $menu = $("#dropdownMenu");

    $btn.on("click", function (e) {
        e.stopPropagation();
        $menu.toggle();
    });

    $(document).on("click", function () {
        $menu.hide();
    });


    const $inputs = $('.otp-input');

    // Chỉ bật ô đầu tiên
    $inputs.prop('disabled', true);
    $inputs.first().prop('disabled', false).focus();

    $inputs.on('input', function () {
        const $this = $(this);
        const index = $inputs.index(this);
        const value = $this.val();

        // Chỉ cho nhập số
        if (!/^\d$/.test(value)) {
            $this.val('');
            return;
        }

        // Nếu hợp lệ và chưa phải ô cuối thì bật ô tiếp theo
        if (index < $inputs.length - 1) {
            $inputs.eq(index + 1).prop('disabled', false).focus();
        }
    });

    $inputs.on('keydown', function (e) {
        const index = $inputs.index(this);

        // Cho phép điều hướng bằng backspace
        if (e.key === 'Backspace' && !$(this).val() && index > 0) {
            $inputs.eq(index - 1).focus();
        }
    });

    // Optional: ngăn dán nhiều ký tự
    $inputs.on('paste', function (e) {
        e.preventDefault();
    });

    $(function () {
        const selectedType = $('#loaiThuvien').val();

        // Hiện loading lúc đầu
        $('.loadingOverlay').fadeIn(200);

        setTimeout(() => {
            filterByType(selectedType);
            $('.loadingOverlay').fadeOut(200);
        }, 500);

        $('#loaiThuvien').on('change', function () {
            const selectedType = $(this).val();

            // Ẩn toàn bộ trước
            $('[data-type]').hide();

            $('.loadingOverlay').fadeIn(200);

            setTimeout(() => {
                filterByType(selectedType);
                $('.loadingOverlay').fadeOut(200);
            }, 500);
        });

        function filterByType(type) {
            $('[data-type]').hide();
            $('[data-type="' + type + '"]').fadeIn(200);
        }
    });

    const MAX_FILE_SIZE_MB = 25;

    function formatFileSize(sizeInBytes) {
        if (sizeInBytes >= 1048576) {
            return (sizeInBytes / 1048576).toFixed(2) + ' MB';
        } else {
            return (sizeInBytes / 1024).toFixed(2) + ' KB';
        }
    }

    // Danh sách file tạm lưu (client-side)
    let uploadedFiles = [];

    $(document).on('change', '.upload-input', function (e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const $group = $(this).closest('.upload-group');
        const $preview = $group.find('.preview');

        // Thêm từng file vào danh sách
        files.forEach((file, index) => {
            const id = `${file.name}-${file.size}-${Date.now() + index}`;
            uploadedFiles.push({ file, id });
            let iconSVG = '';

            if (file.type.startsWith('image/')) {
                iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 48 48"><path fill="#90caf9" d="M40 45H8V3h22l10 10z"/><path fill="#e1f5fe" d="M38.5 14H29V4.5z"/><path fill="#1565c0" d="m21 23l-7 10h14z"/><path fill="#1976d2" d="M28 26.4L23 33h10z"/><circle cx="31.5" cy="24.5" r="1.5" fill="#1976d2"/></svg>';
            } else if (file.type === 'application/pdf') {
                iconSVG = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="#ef5350" d="M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m4.93 10.44c.41.9.93 1.64 1.53 2.15l.41.32c-.87.16-2.07.44-3.34.93l-.11.04l.5-1.04c.45-.87.78-1.66 1.01-2.4m6.48 3.81c.18-.18.27-.41.28-.66c.03-.2-.02-.39-.12-.55c-.29-.47-1.04-.69-2.28-.69l-1.29.07l-.87-.58c-.63-.52-1.2-1.43-1.6-2.56l.04-.14c.33-1.33.64-2.94-.02-3.6a.85.85 0 0 0-.61-.24h-.24c-.37 0-.7.39-.79.77c-.37 1.33-.15 2.06.22 3.27v.01c-.25.88-.57 1.9-1.08 2.93l-.96 1.8l-.89.49c-1.2.75-1.77 1.59-1.88 2.12c-.04.19-.02.36.05.54l.03.05l.48.31l.44.11c.81 0 1.73-.95 2.97-3.07l.18-.07c1.03-.33 2.31-.56 4.03-.75c1.03.51 2.24.74 3 .74c.44 0 .74-.11.91-.3m-.41-.71l.09.11c-.01.1-.04.11-.09.13h-.04l-.19.02c-.46 0-1.17-.19-1.9-.51c.09-.1.13-.1.23-.1c1.4 0 1.8.25 1.9.35M7.83 17c-.65 1.19-1.24 1.85-1.69 2c.05-.38.5-1.04 1.21-1.69zm3.02-6.91c-.23-.9-.24-1.63-.07-2.05l.07-.12l.15.05c.17.24.19.56.09 1.1l-.03.16l-.16.82z"/></svg>
                `;
            } else {
                iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 48 48"><path fill="#90caf9" d="M40 45H8V3h22l10 10z"/><path fill="#e1f5fe" d="M38.5 14H29V4.5z"/></svg>';
            }

            const fileItem = $(`
                <div class="file-item" data-id="${id}">
                    <div class="file-left">
                        <div class="file-icon">
                            ${iconSVG}
                        </div>
                        <div class="file-info">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${formatFileSize(file.size)}</div>
                        </div>
                    </div>
                    <div class="file-right">
                        <div class="file-close" style="cursor:pointer;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="#000" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/></svg>
                        </div>
                    </div>
                </div>
            `);

            $preview.append(fileItem);
        });

        // Reset input để chọn lại được cùng file
        $(this).val('');
    });

    $(document).on('click', '.file-close', function () {
        const $fileItem = $(this).closest('.file-item');
        const fileId = $fileItem.data('id');

        // Xoá khỏi DOM
        $fileItem.remove();

        // Xoá khỏi danh sách tạm
        uploadedFiles = uploadedFiles.filter(item => item.id !== fileId);
    });

    $('.action-button').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const $button = $(this);
        const textToCopy = $button.find('.desc').text();
        const $iconSpan = $button.find('.button-icon');

        const originalSVG = $iconSpan.html(); // lưu SVG ban đầu
        const checkSVG = `
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#28a745" viewBox="0 0 256 256">
            <path d="M229.66,77.66a8,8,0,0,1,0,11.32l-112,112a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L112,180.69,218.34,77.66A8,8,0,0,1,229.66,77.66Z"></path>
          </svg>
        `;

        navigator.clipboard.writeText(textToCopy).then(function () {
            $iconSpan.html(checkSVG); // thay icon

            setTimeout(() => {
                $iconSpan.html(originalSVG); // đổi lại icon ban đầu
            }, 2000);
        }).catch(function (err) {
            console.error('Copy failed', err);
        });
    });

    document.querySelectorAll('.file-item').forEach((fileItem) => {
        const filePreview = fileItem.querySelector('.file-preview');
        const closeIcon = fileItem.querySelector('.close-icon');

        // Khi click vào file-item, thêm class active cho file-preview
        fileItem.addEventListener('click', () => {
            filePreview.classList.add('active');
        });

        // Khi click close-icon, remove class active và ngăn sự kiện lan ra cha
        closeIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // ngăn không cho sự kiện lan tới .file-item
            filePreview.classList.remove('active');
        });
    });

    $('.popup-share .public').on('click', function () {
        $('.public-options').toggleClass('active');
    });

    $('.btn-share').on('click', function () {
        $('.popup-share').addClass('active');
        $('.blur').addClass('active');
    });

    $('.popup-share .close').on('click', function () {
        $('.popup-share').removeClass('active');
        $('.blur').removeClass('active');
    });

    typeEffect($('.welcome-title'), 40);
    typeEffect($('.intro-text'), 20);
    typeEffect($('.result-section .responseMessage .desc'), 30);

    let currentAudio = null; // Biến lưu audio đang phát
    let currentIcon = null;  // Biến lưu icon đang active

    $('.content').each(function () {
        const content = $(this);
        const audioElement = content.find('.audio-document')[0];
        const text = content.find('.content-text').text().trim();
        const encodedText = convertSpacesToEncoded(text);
        const src = `https://wf.vnpt.me/api/tts?Text=${encodedText}`;
        $(audioElement).attr('src', src);

        const icon = content.find('.icon');

        content.find('.voice').on('click', function () {
            // Nếu nhấn vào đúng đoạn đang phát hiện tại
            if (audioElement === currentAudio) {
                if (audioElement.paused) {
                    audioElement.play();              // Tiếp tục phát
                    icon.addClass('active');
                } else {
                    audioElement.pause();             // Tạm dừng
                    icon.removeClass('active');
                }
                return; // Kết thúc xử lý
            }

            // Nếu nhấn vào đoạn khác:
            if (currentAudio) {
                currentAudio.pause();                // Dừng đoạn cũ
                currentAudio.currentTime = 0;        // Reset về đầu
                currentIcon?.removeClass('active');  // Bỏ hiệu ứng active
            }

            // Play đoạn mới
            audioElement.play();
            icon.addClass('active');

            // Cập nhật biến đang phát
            currentAudio = audioElement;
            currentIcon = icon;
        });

        // Khi audio kết thúc, tự động xóa trạng thái active
        $(audioElement).on('ended', function () {
            icon.removeClass('active');
            if (currentAudio === audioElement) {
                currentAudio = null;
                currentIcon = null;
            }
        });
    });


    $('.content').each(function () {
        const content = $(this);
        const editorElement = content.find('.editor-content')[0];
        const contentTextEl = content.find('.content-text')[0];

        if (editorElement) {
            
        }

        if (contentTextEl && editorElement) {
            const textContent = contentTextEl.innerHTML.trim();
            

            const quill = new Quill(editorElement, {
                theme: 'snow',
                readOnly: false
            });

            quill.root.innerHTML = textContent;
        }
    });

    $('.enabled-edit').on('click', function () {
        $('.content').each(function () {
            $(this).addClass('active')
        });
    })
});

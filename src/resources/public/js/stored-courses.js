document.addEventListener('DOMContentLoaded', function () {
    let courseId = null;

    const deleteForm = document.forms['delete-course-form'];
    const btnDeleteCourse = document.getElementById('btn-delete-course');
    const checkboxAll = document.getElementById('checkbox-all');
    const courseItemCheckboxes = document.querySelectorAll('input[name="courseIds[]"]');
    const checkAllSubmitBtn = document.querySelector('.check-all-submit-btn');
    const restoreBtns = document.querySelectorAll('.btn-restore');
    const restoreForm = document.forms['restore-course-form'];
    const deleteModal = document.getElementById('delete-course-modal');

    // Lấy courseId khi click nút Xóa mềm
    document.querySelectorAll('[data-toggle="modal"]').forEach(button => {
        button.addEventListener('click', function () {
            courseId = this.getAttribute('data-id'); // Lấy ID từ data-id
            btnDeleteCourse.setAttribute('data-action', 'force'); // Gán action là force delete
        });
    });

    // Xử lý Xóa mềm
    document.querySelectorAll('.btn-delete-soft').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const softDeleteId = this.getAttribute('data-id');
            deleteForm.action = `/courses/${softDeleteId}?_method=DELETE`;
            deleteForm.submit();
        });
    });

    // Xử lý Xóa vĩnh viễn khi nhấn nút trong modal
    btnDeleteCourse.addEventListener('click', function () {
        if (!courseId) {
            alert('No course selected for deletion!');
            return;
        }

        // Xác định URL cho Xóa vĩnh viễn
        deleteForm.action = `/courses/${courseId}/force?_method=DELETE`;
        deleteForm.submit();
    });

    // 3. Xử lý checkbox "Chọn tất cả"
    checkboxAll.addEventListener('change', function () {
        const isCheckedAll = this.checked;
        courseItemCheckboxes.forEach(checkbox => {
            checkbox.checked = isCheckedAll;
        });

        renderCheckAllSubmitBtn();
    });

    // 4. Xử lý checkbox từng item
    courseItemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const allChecked = [...courseItemCheckboxes].every(item => item.checked);
            checkboxAll.checked = allChecked;

            renderCheckAllSubmitBtn();
        });
    });

    // 5. Kích hoạt hoặc vô hiệu hóa nút Submit
    function renderCheckAllSubmitBtn() {
        const checkedCount = document.querySelectorAll('input[name="courseIds[]"]:checked').length;

        if (checkedCount > 0) {
            checkAllSubmitBtn.removeAttribute('disabled');
        } else {
            checkAllSubmitBtn.setAttribute('disabled', 'true');
        }
    }

    // 6. Khôi phục khóa học
    restoreBtns.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const courseId = button.getAttribute('data-id');
            if (courseId) {
                restoreForm.action = `/courses/${courseId}/restore?_method=PATCH`;
                restoreForm.submit();
            }
        });
    });
});
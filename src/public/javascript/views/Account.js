import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Account");
    }

    async getHtml(content) {
        $.ajax({
            url: "http://localhost:3000/api/user",
            contentType: "application/json",
            success: function (response) {
                const htmls =
                    `
                        <div class="container-wrapper">
                            <div class="my-account-header">
                                <h3>My information</h3>
                            </div>
                            <div class="my-account-content">
                                <div class="my-account-photo">
                                    <div class="modal-content-info-photo">
                                        <input type="file" class="playlist-photo" accept="image/png, image/jpeg">
                                    <div class="modal-content-info-choose-btn">
                                        <i class="fas fa-camera"></i>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div class="my-account-information">
                                <form action="/api/user/${response.id}/edit" method="post" name="form-account-edit" id="form-account-edit">
                                    <div class="form-content">
                                        <div class="form-group">
                                            <label for="email">Your email: </label>
                                            <input type="email" class="form-control" name="email" value="${response.email}" disabled>
                                        </div>
                                        <div class="form-group">
                                            <label for="password">Your password: </label>
                                            <input type="password" class="form-control" name="password" disabled>
                                            <button class="btn-change-account">CHANGE</button>
                                        </div>
                                        <div class="form-group">
                                            <label for="username">Username: </label>
                                            <input type="text" class="form-control" name="username" value="${response.name}" disabled>
                                            <button class="btn-change-account">CHANGE</button>
                                        </div>
                                    </div>
                                    <button id="my-account-btn-save">SAVE</button>
                                </form>
                            </div>
                            </div>
                        </div>
                    `
                content.html(htmls);
                editAccount();
            }
        })

    }

}

function editAccount() {
    const editForm = document.forms['form-account-edit'];
    $('.btn-change-account').click((e) => {
        e.target.disabled = true;
        const node = e.target.parentElement.children[1];
        node.disabled = false;
        if(node.name === "password") {
            let x = document.createElement("div");
            x.classList.add("form-group");
            node.parentElement.after(x);
            const html = 
                        `
                            <label for="password-confirm">New Password: </label>
                            <input type="password" class="form-control" name="passwordConfirm">
                        `
            x.innerHTML = html;
        }
    })
    $('#my-account-btn-save').click((e) => {
        if($('input[name=password]').val() === '') {
            e.preventDefault();
        } else {
            editForm.submit();
        }
    })
}

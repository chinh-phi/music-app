
function Validator(options) {
    var formElement = document.querySelector(options.form);

    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage = rule.test(inputElement.value);

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }

        return !errorMessage;
    }

    if (formElement) {

        formElement.onsubmit = function(e) {
            var isFormValid = true;
            

            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                // console.log(isValid);
                if(!isValid) {
                    isFormValid = false;
                }
            });
            if (!isFormValid) {
                e.preventDefault();
            }
        }

        options.rules.forEach(function (rule) {
            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {

                // blur khoi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                // xu ly moi khi nguoi dung nhap input
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        })
    }
}

Validator.isRequired = function (selector, message) {
    return {
        selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Your username must contain at least 2 characters.';
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'The format of your email address is not valid.'
        }
    }
}

Validator.minLength = function (selector, min) {
    return {
        selector,
        test: function (value) {
            return value.length >= min ? undefined : `Your password must contain at least ${min} characters.`;
        }
    }
}

Validator.isConfirm = function (selector, getConfirmValue, message) {
    return {
        selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Gia tri nhap vao khong chinh xac';
        }
    }
}

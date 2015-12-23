;(function (){
    "use strict"

    var submit = document.getElementById('sub');

    submit.addEventListener('click',function (event) {
        // Отмена события по умолчанию!
        event.preventDefault();
        console.log("Отправка сообщения!");

        // Создание нового объекта XMLHttpRequest
        var xhr = new XMLHttpRequest ();

        xhr.open('POST', 'index.php', false);

        xhr.send();

        // Проверка на приходящий ответ с сервера
        if (xhr.status != 200) {
            // обработать ошибку
            alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
        } else {
            // вывести результат
            alert( xhr.responseText ); // responseText -- текст ответа.
        }
    });


})();

var main = function(toDoObjects) {
    "use strict";
    console.log("SANITY CHECK");
    var toDos = toDoObjects.map(function(toDo) {

        return toDo.description;
    });

    $(".tabs a span").toArray().forEach(function(element) {
        var $element = $(element);


        $element.on("click", function() {
            var $d, i;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                $d = $("<ul id='newList'>");
                for (i = toDos.length - 1; i >= 0; i--) {
                    $d.append($("<li>").text(toDos[i]));
                }
            } else if ($element.parent().is(":nth-child(2)")) {
                $d = $("<ul id='oldList'>");
                toDos.forEach(function(todo) {
                    $d.append($("<li>").text(todo));
                });

            } else if ($element.parent().is(":nth-child(3)")) {
                var tags = [];

                toDoObjects.forEach(function(toDo) {
                    toDo.tags.forEach(function(tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });
                console.log(tags);

                var tagObjects = tags.map(function(tag) {
                    var toDosWithTag = [];
                    toDoObjects.forEach(function(toDo) {
                        if (toDo.tags.indexOf(tag) !== -1) {
                            toDosWithTag.push(toDo.description);
                        }
                    });

                    return {
                        "name": tag,
                        "toDos": toDosWithTag
                    };
                });

                console.log(tagObjects);

                tagObjects.forEach(function(tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $d = $("<ul id='tagList'>");
                    tag.toDos.forEach(function(description) {
                        var $li = $("<li>").text(description);
                        $d.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($d);
                });

            } else if ($element.parent().is(":nth-child(4)")) { //"Add" Tab
                var $input = $("<input>").addClass("description"),
                    $inputLabel = $("<p>").text("Description: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Tags: "),
                    $button = $("<span>").text("Add");

                $button.on("click", function() {
                    var description = $input.val(),
                        tags = $tagInput.val().split(","),
                        newToDo = {
                            "description": description,
                            "tags": tags
                        };

                    $.post("todos", newToDo, function(result) {
                        console.log(result);


                        toDoObjects = result;


                        toDos = toDoObjects.map(function(toDo) {
                            return toDo.description;
                        });

                        $input.val("");
                        $tagInput.val("");
                    });

                    socket.emit("add", newToDo);
                });

                $d = $("<div>").append($inputLabel)
                    .append($input)
                    .append($tagLabel)
                    .append($tagInput)
                    .append($button);
            }

            $("main .content").append($d);

            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");


    var socket = io();
    socket.on("newToDO", function(data) {
        console.log("new item added");
        var $n = $("#newList"),
            $o = $("#oldList"),
            $tab1 = $("#tagList"),
            $tab2 = data.description,
            $tab3 = data.tags,
            $items = $("<li>").text($tab2).hide();

        if (($n.length) > 0) {
            $n.prepend($items);
            $items.slideDown(300);
        } else if (($o.length) > 0) {
            $o.append($items);
            $items.slideDown(300);
        } else if (($tab1.length) > 0) {
            $("main .content").append($("<h3>").text($tab3));
            $("main .content").append($items);
            $items.slideDown(300);
        }

        $.getJSON("todos.json", function(newToDoObjects) {
            toDoObjects = newToDoObjects;
            toDos = newToDoObjects.map(function(toDo) {
                return toDo.description;
            });
        });
        alert("New item added");
    });

};

$(document).ready(function() {
    $.getJSON("todos.json", function(toDoObjects) {
        main(toDoObjects);
    });
});
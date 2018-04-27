#latte_class

##removeIdle

```js
```

##queue


##fileObject

```js
  let fo = latte_class.FileObject.create({
    filePath: __dirname + "/config.json"
  });
  fo.set("path", "./app.js");
  fo.close();
```
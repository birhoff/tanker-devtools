# tanker-inspector

## Установка

1. Перейти на browser://extensions/ для Яндекс.Браузера или chrome://extensions для Хрома.
2. В правом верхнем углу включить Режим разработчика.
3. Перетащить папку с расширением на страницу, убедиться, что оно включено.

## Принцип работы

1. Пакет `i18n` должен вместо строки с переводом вернуть строку в формате `TANKERBEGIN${translation}:${keyset}:${key}TANKEREND`.

Патч, который обеспечивает такое поведение в `web4`:

```diff
diff --git a/blocks-common/i-bem/__i18n/i-bem__i18n.priv.js b/blocks-common/i-bem/__i18n/i-bem__i18n.priv.js
new file mode 100644
index 00000000000..f2d7e16e187
--- /dev/null
+++ b/blocks-common/i-bem/__i18n/i-bem__i18n.priv.js
@@ -0,0 +1,11 @@
+if (BEM.I18N) {
+    var initialI18n = BEM.I18N;
+
+    BEM.I18N = function(keyset, key, params) {
+        return `TANKERBEGIN${initialI18n(keyset, key, params)}:${keyset}:${key}TANKEREND`;
+    };
+
+    Object.keys(initialI18n).forEach(function(key) {
+        BEM.I18N[key] = initialI18n[key];
+    });
+}
```

2. Расширение перебирает все строковые DOM-узлы, находит среди них те, что соответствуют формату и заменяют на перевод, а данные пробрасывают в панель в виде ссылок на соответствующие ключи в Танкере.

3. При наведении на ссылки страница подскролливается к соответствующему элементу, а элемент подсвечивается.

## Внутренне устройство

Взаимодействие с DOM возможно только из `content.js`.
Доступ к содержимому панели расширения в `panel.js`.
Их прямо взаимодействие невозможно по соображениям безопасности, поэтому обмен данными происходит с помощью сообщений через `background.js`, который работает в фоне.

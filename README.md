یک XHttp ساده روی سرویس dockfly :
مراحل
کافیه پروژه رو Fork کنید روی گیتهاب خودتون
2- وارد سایت https://dockfly.app/ بشید
3- اکانت بسازید با گیتهاب خودتون ( گیتهابی که فورک کردین پروژه رو روش)
4- حالا قسمت projects  > new projects یه اسم دلخواه بذارین روش و creat  رو بزنید
 در قسمت بعد add first service  رو بزنید و گزینه اول github رو انتخاب کنید، صبر کنید داخل کادر Select a repository ، پروژه های گیتهابتون بیاد بالا ، پروژه ای رو که Fork کردین رو انتخاب کنید(fly-reki)
 داحل صفحه ی Configure service > web < medium  و creat  رو بزنید ، پروژه که ساخته شد روش کلیک کنید تا صفحه مدیریتش باز بشه
 5- روی variables از منوی بالا کلیک کنید و داین مقادیر رو بهش بدین:
 
RELAY_PATH=/xhttp(دلخواه/)

TARGET_HOST=yourdomin.io (دامین سرورتون)

TARGET_PORT=443
دیپلوی رو بزنید و تمام . آدرس لینکی که بهتون میده رو تو قسمت overview  بذارید تو کانفیگ xhttp سرورتون تمام.
sni-host-address

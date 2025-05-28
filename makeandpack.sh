mkdir $2
cp $2.advert $2/
deno --allow-all main.ts --tune-json=$1 --with-advert=$2.advert --out=$2/cv.html
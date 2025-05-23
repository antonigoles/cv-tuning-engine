# CV Tuning engine

Troll le ATS systems epic style

## How to run from scratch (linux only)

### A. With GPT
>omgegalul


### B. With OLLAMA (epic)

>Note: Default model runs well on 12GB RTX 3060

**0.** Create `.env` file in project directory with variables from `.env.example`
```
EXPORTS_FOLDER_PATH= 
ASSETS_FOLDER_PATH=
OPEN_AI_TOKEN=
OLLAMA_URL=http://localhost:11434 # This value should be universal
```

**1.** Install ollama cli from https://ollama.com/ 

**2.** Install `gemma3:4b` model in ollama 
```
ollama run gemma3:4b
```
**3.** Install deno from https://deno.com/

**4.** Run with `deno --allow-all main.ts`

Example usage:

```bash
deno --allow-all main.ts \
    --tune-json=./assets/my_base_cv.json \
    --with-advert=./assets/advert.txt \
    --out=./exports/result.html \
```





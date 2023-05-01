## update conda env
add a code block.

``` bash
conda env update -f speechenv.yml
```


## convert audio file

```bash
ffmpeg -i input.mp3 -acodec pcm_s16le -ac 1 -ar 16000 output.wav
```
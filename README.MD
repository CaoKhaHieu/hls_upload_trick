#### REFERENCES
- https://animehay.li/
- https://ninoyo.com/

#### CONVERT MP4 TO HLS
```bash
ffmpeg -i example_data/input.mp4 -codec: copy -start_number 1 -hls_time 10 -hls_list_size 0 \
-hls_segment_filename "hls/segment_%d.ts" -f hls hls/playlist.m3u8
```

#### CLEAN TS SEGMENTS
```python
python3 clean.py
```

#### CONVERT TS TO PNG
```python
python3 convert.py
```

#### UPLOAD PNG TO TIKTOK
```python
npm run upload
```

#### VIEW SEGMENT INFO
xxd -c 16 -g 1 ./hls/example.ts | head -n 10

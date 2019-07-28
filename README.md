# 自作した壁ボタンコントローラのためのプロジェクト

# セットアップ

```
git clone https://github.com/jirokun/WallButtons.git
sudo apt-get update
sudo apt-get install -y nodejs npm
sudo npm cache clean
sudo npm install n -g
sudo n stable
cd WallButtons/backend/
npm install
```

# ALSAの設定
usbオーディオを使う場合にはALSAでmixwerを使用するように設定しないと、同時に複数の音を出すことができない。
そこで、~/.asoundrcを下記のように書き換え、mixerを利用する。

```
pcm.!default {
  type hw
  card 1
}

ctl.!default {
  type hw
  card 1
}

pcm.!default {
  type plug
  slave.pcm "dmixer"
}

pcm.dmixer {
  type dmix
  ipc_key 1024
  slave {
    pcm "hw:1,0"
    period_time 0
    period_size 1024
    buffer_size 4096
    rate 44100
  }
  bindings {
    0 0
    1 1
  }
}
```


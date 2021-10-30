FROM node:lts

ENV RUSTUP_HOME=/usr/local/rustup \
  CARGO_HOME=/usr/local/cargo \
  PATH=/usr/local/cargo/bin:$PATH

RUN wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key | apt-key add - && \
  echo "deb http://apt.llvm.org/buster/ llvm-toolchain-buster main" >> /etc/apt/sources.list && \
  echo "deb-src http://apt.llvm.org/buster/ llvm-toolchain-buster main" >> /etc/apt/sources.list && \
  apt-get update && \
  apt-get install -y --fix-missing \
  llvm \
  clang \
  rcs \
  cmake \
  gcc-aarch64-linux-gnu \
  g++-aarch64-linux-gnu \
  gcc-arm-linux-gnueabihf \
  g++-arm-linux-gnueabihf \
  ninja-build && \
  curl https://sh.rustup.rs -sSf | sh -s -- -y && \
  rustup target add aarch64-unknown-linux-gnu && \
  rustup target add armv7-unknown-linux-gnueabihf

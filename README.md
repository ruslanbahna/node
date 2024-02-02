# node
Dockerfile



# Use the official Ubuntu base image as a starting point
FROM ubuntu:latest

# Install dependencies required for nvm and Node.js
RUN apt-get update && \
    apt-get install -y curl git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install nvm
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 21.6.1

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && \
    . "$NVM_DIR/nvm.sh" && \
    nvm install $NODE_VERSION && \
    nvm use $NODE_VERSION && \
    nvm alias default $NODE_VERSION

# Add nvm, Node.js, and npm to PATH
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Verify installation
RUN node --version && npm --version

# Your container's CMD or ENTRYPOINT here
# For example, start a bash shell
CMD [ "bash" ]
FROM kalilinux/kali-rolling

# Installer outils + dépendances nécessaires
RUN apt update && apt install -y \
    wget curl nano zsh python3 python3-pip python2 python2-dev \
    ruby ruby-dev build-essential git \
    libyaml-dev \
    net-tools nmap gobuster dirb ffuf nikto exploitdb \
    && rm -rf /var/lib/apt/lists/*

# Installer pip pour Python 2
RUN wget https://bootstrap.pypa.io/pip/2.7/get-pip.py -O /tmp/get-pip.py && \
    python2 /tmp/get-pip.py && \
    rm /tmp/get-pip.py

# Installer GoTTY
RUN ARCH=$(dpkg --print-architecture) && \
    if [ "$ARCH" = "amd64" ]; then \
        wget -O /tmp/gotty.tar.gz \
        https://github.com/sorenisanerd/gotty/releases/download/v1.5.0/gotty_v1.5.0_linux_amd64.tar.gz && \
        tar -xvf /tmp/gotty.tar.gz -C /usr/local/bin/ && \
        chmod +x /usr/local/bin/gotty && \
        rm /tmp/gotty.tar.gz ; \
    else \
        echo "Unsupported architecture: $ARCH" && exit 1 ; \
    fi

# Installer WhatWeb
RUN git clone https://github.com/urbanadventurer/WhatWeb.git /opt/whatweb && \
    cd /opt/whatweb && \
    gem install bundler && \
    bundle install && \
    ln -s /opt/whatweb/whatweb /usr/local/bin/whatweb

# Installer WPScan
RUN gem install wpscan

# Installer les wordlists SecLists
RUN mkdir -p /wordlists && \
    cd /wordlists && \
    wget https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/raft-large-directories.txt && \
    wget https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt && \
    wget https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/big.txt && \
    wget -O directory-list-2.3-medium.txt \
    https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/DirBuster-2007_directory-list-2.3-medium.txt

WORKDIR /root

CMD ["/bin/bash"]
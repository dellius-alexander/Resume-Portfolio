#!/usr/bin/env bash
#/**
# *    Copyright 2022 Dellius Alexander
# *
# *    Licensed under the Apache License, Version 2.0 (the "License");
# *    you may not use this file except in compliance with the License.
# *    You may obtain a copy of the License at
# *
# *        http://www.apache.org/licenses/LICENSE-2.0
# *
# *    Unless required by applicable law or agreed to in writing, software
# *    distributed under the License is distributed on an "AS IS" BASIS,
# *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# *    See the License for the specific language governing permissions and
# *    limitations under the License.
# */
###########################################################
set -e
USERNAME=node
USER_UID=1000
USER_GID=1000

#apt-get update -y \
#&& apt-get -y install --no-install-recommends apt-utils 2>&1
# Verify git, process tools, lsb-release (common in install instructions for CLIs) installed
#apt-get update -y \
#&& apt-get -y install git procps lsb-release
#
# Create a non-root user to use if preferred - see https://aka.ms/vscode-remote/containers/non-root-user.
groupadd --gid $USER_GID $USERNAME &2>/dev/null &&
useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME &2>/dev/null &&
# [Optional] Uncomment the next three lines to add sudo support
apt-get update -y &2>/dev/null  &&
apt-get install -y sudo &2>/dev/null &&
echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME &&
chmod 0440 /etc/sudoers.d/$USERNAME &2>/dev/null &&
mkdir -p "/home/${USERNAME}/app" &2>/dev/null
# # Clean up
# apt-get autoremove -y \
# && apt-get clean -y \
# && rm -rf /var/lib/apt/lists/*
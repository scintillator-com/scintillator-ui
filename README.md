# Scintillator UI

## Build Dependencies
### Global
```sh
sudo apt install nodejs npm
sudo npm install --global n

# LTS
sudo n 14.15.1

#Note: the node command changed location and the old location may be remembered in your current shell.
#         old : /usr/bin/node
#         new : /usr/local/bin/node
#To reset the command location hash either start a new shell, or execute PATH="$PATH"

npm install
npm run build
```

# NOTE: generate map files, but don't copy them


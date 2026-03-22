UUID = otoyeet@goodbot.dev
EXTENSION_PATH = ~/.local/share/gnome-shell/extensions/$(UUID)

all: build

build:
	yarn build

install: build
	mkdir -p $(EXTENSION_PATH)
	cp -r dist/* $(EXTENSION_PATH)/
	@echo "Restart GNOME Shell (Alt+F2, r, Enter on X11; log out/in on Wayland)."
	@echo "Then enable: gnome-extensions enable $(UUID)"

uninstall:
	rm -rf $(EXTENSION_PATH)
	@echo "Otoyeet extension uninstalled."

package:
	./resources/package.sh

clean:
	yarn clean

.PHONY: all build install uninstall package clean

import yaml
import time
import threading
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class ConfigWatcher(FileSystemEventHandler):
    def __init__(self, config_file, callback):
        self.config_file = config_file
        self.callback = callback

    def on_modified(self, event):
        if event.src_path == self.config_file:
            print(f"Configuration file {self.config_file} modified. Reloading...")
            self.callback()

class Config:
    _config = None
    _config_file = None
    _callback = None
    _observer = None

    @classmethod
    def initialize(cls, config_file, callback):
        """Initialize the configuration loader once."""
        if cls._config_file is None:
            cls._config_file = config_file
            cls._callback = callback
            cls._config = cls.load_config()
            cls._start_watcher()

    @classmethod
    def load_config(cls):
        """Load YAML configuration from file."""
        try:
            with open(cls._config_file, 'r') as file:
                cls._config = yaml.safe_load(file)
                return cls._config
        except Exception as e:
            print(f"Error loading configuration: {e}")
            return None

    @classmethod
    def _start_watcher(cls):
        """Start a background thread to watch for config file changes."""
        event_handler = ConfigWatcher(cls._config_file, cls.reload_config)
        cls._observer = Observer()
        cls._observer.schedule(event_handler, path=cls._config_file, recursive=False)
        observer_thread = threading.Thread(target=cls._observer.start, daemon=True)
        observer_thread.start()

    @classmethod
    def reload_config(cls):
        """Reload configuration and invoke the callback."""
        cls._config = cls.load_config()
        if cls._callback:
            cls._callback()

    @classmethod
    def get_config(cls):
        """Return the current configuration."""
        return cls._config
    
    @classmethod
    def get(cls, key, default=None):
        """Retrieve a specific key from the configuration."""
        return cls._config.get(key, default) if cls._config else default


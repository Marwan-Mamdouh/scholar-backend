from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Gemini AI provider
    ai_api_key: str = ""
    ai_model: str = "gemini-3.6-flash"

    # Limits
    max_cv_size_mb: int = 10
    max_cv_text_chars: int = 80000
    ai_timeout_seconds: int = 60
    ai_max_retries: int = 2


settings = Settings()

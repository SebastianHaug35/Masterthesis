from dataclasses import dataclass, field
from threading import Lock
from typing import Dict, List, Optional
from uuid import uuid4


@dataclass
class ChatMessage:
    role: str
    content: str


@dataclass
class ContextDocument:
    name: str
    content: str


@dataclass
class ChatSession:
    session_id: str
    messages: List[ChatMessage] = field(default_factory=list)
    context_docs: List[ContextDocument] = field(default_factory=list)
    status: str = "idle"
    last_trace: List[str] = field(default_factory=list)


class InMemorySessionStore:
    def __init__(self) -> None:
        self._lock = Lock()
        self._sessions: Dict[str, ChatSession] = {}

    def create_session(self) -> ChatSession:
        session = ChatSession(session_id=str(uuid4()))
        with self._lock:
            self._sessions[session.session_id] = session
        return session

    def get_session(self, session_id: str) -> Optional[ChatSession]:
        with self._lock:
            return self._sessions.get(session_id)

    def append_message(self, session_id: str, role: str, content: str) -> ChatSession:
        with self._lock:
            session = self._sessions[session_id]
            session.messages.append(ChatMessage(role=role, content=content))
            return session

    def set_status(self, session_id: str, status: str) -> ChatSession:
        with self._lock:
            session = self._sessions[session_id]
            session.status = status
            return session

    def set_trace(self, session_id: str, trace: List[str]) -> ChatSession:
        with self._lock:
            session = self._sessions[session_id]
            session.last_trace = list(trace)
            return session

    def upsert_context_doc(self, session_id: str, name: str, content: str) -> ChatSession:
        with self._lock:
            session = self._sessions[session_id]
            existing = {doc.name: doc for doc in session.context_docs}
            existing[name] = ContextDocument(name=name, content=content)
            session.context_docs = list(existing.values())
            return session


store = InMemorySessionStore()

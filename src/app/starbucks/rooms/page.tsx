"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { Input } from "@/components/ui/Input";
import {
  addRoom,
  getRoomsSnapshot,
  getServerRoomsSnapshot,
  subscribeRooms,
  type Room,
} from "@/lib/rooms";
import { setSession } from "@/lib/session";

export default function StarbucksRoomsPage() {
  const router = useRouter();
  const rooms = useSyncExternalStore(
    subscribeRooms,
    getRoomsSnapshot,
    getServerRoomsSnapshot,
  );

  const [joiningRoom, setJoiningRoom] = useState<Room | null>(null);
  const [userName, setUserName] = useState("");

  const [creating, setCreating] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [allowedNamesRaw, setAllowedNamesRaw] = useState("");

  function handleCreateRoom() {
    if (!roomName.trim()) return;
    addRoom(roomName.trim(), allowedNamesRaw);
    setCreating(false);
    setRoomName("");
    setAllowedNamesRaw("");
  }

  function handleJoinRoom() {
    if (!userName.trim() || !joiningRoom) return;
    setSession({ roomId: joiningRoom.id, userName: userName.trim() });
    setJoiningRoom(null);
    setUserName("");
    router.push("/starbucks");
  }

  return (
    <div className="flex flex-1 flex-col bg-region-surface">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-hairline bg-canvas px-4">
        <Link
          href="/"
          aria-label="홈으로"
          className="flex h-9 w-9 items-center justify-center rounded-full text-secondary hover:bg-surface"
        >
          ←
        </Link>
        <h1 className="text-h3 text-foreground">방 리스트</h1>
      </header>

      <div className="flex-1 px-6 py-8">
        {rooms.length === 0 ? (
          <p className="mt-16 text-center text-body text-secondary">
            아직 생성된 방이 없어요. 방을 만들어보세요!
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {rooms.map((room) => (
              <li key={room.id}>
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() => setJoiningRoom(room)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") setJoiningRoom(room);
                  }}
                  className="cursor-pointer p-4 transition-colors hover:bg-surface"
                >
                  <p className="text-h3 text-foreground">{room.name}</p>
                  {room.allowedNames.length > 0 && (
                    <p className="mt-1 text-caption text-secondary">
                      {room.allowedNames.join(" · ")}
                    </p>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>

      <FloatingButton onClick={() => setCreating(true)}>
        + 방 생성
      </FloatingButton>

      <Dialog
        open={joiningRoom !== null}
        onClose={() => setJoiningRoom(null)}
        title={joiningRoom ? `${joiningRoom.name}에 입장할까요?` : ""}
      >
        <div className="flex flex-col gap-4">
          <Input
            variant="outlined"
            placeholder="사용자 이름"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            autoFocus
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1 rounded-action"
              onClick={() => setJoiningRoom(null)}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="primary"
              className="flex-1 rounded-action"
              onClick={handleJoinRoom}
              disabled={!userName.trim()}
            >
              확인
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={creating} onClose={() => setCreating(false)} title="방 생성">
        <div className="flex flex-col gap-4">
          <Input
            variant="outlined"
            placeholder="방 이름"
            value={roomName}
            onChange={(event) => setRoomName(event.target.value)}
            autoFocus
          />
          <Input
            variant="outlined"
            placeholder="입장 가능한 이름 (예: 홍길동/김철수)"
            value={allowedNamesRaw}
            onChange={(event) => setAllowedNamesRaw(event.target.value)}
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1 rounded-action"
              onClick={() => setCreating(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="primary"
              className="flex-1 rounded-action"
              onClick={handleCreateRoom}
              disabled={!roomName.trim()}
            >
              확인
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

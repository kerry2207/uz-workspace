"use client";

import { useMemo, useState } from "react";
import {
  Activity, Archive, ArrowRight, ArrowUpDown, Bell, BookOpenCheck, CalendarDays, Camera, Check, CheckCircle2,
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock, Copy, Ellipsis, FileText, Filter, Flag, Folder,
  FilePlus2, Gauge, Gavel, GripVertical, Heading1, House, Image, KanbanSquare,
  LayoutGrid, Link2, List, ListChecks, ListTodo, MapPin, MessageSquare, MessagesSquare, Minus, Paperclip, Quote, Rocket, Video,
  PanelLeftClose, PanelLeftOpen, PanelTop, Pin, Plus, Search, Share2, Sparkles, Star, Table2, TrendingUp, UserPlus,
  Settings, Stamp, Upload, Users, WandSparkles, X,
} from "lucide-react";
import { Button } from "../components/ui/button";

type View = "home" | "inbox" | "calendar" | "meeting" | "tasks" | "document" | "new-page" | "teamspace" | "team" | "member" | "docs" | "comments" | "profile" | "settings" | "projects" | "files" | "recent" | "trash" | "release" | "access-requests";
type TaskStatus = string;
type TaskView = "board" | "table" | "list" | "calendar" | "timeline" | "gallery";
type WorkspaceMode = "empty" | "demo";
type WorkspaceScope = string;
type TaskFilter = "all" | "today" | "urgent" | "review" | "mine";
type BlockKind = "text" | "heading" | "bullets" | "checklist" | "toggle" | "quote" | "callout" | "divider" | "table" | "board" | "image" | "file" | "link" | "page";
type TaskItem = { title: string; project: string; status: TaskStatus; due: string; priority: string; owner: string; collaborators: string[]; tags: string[] };
type WorkspacePerson = { id: string; name: string; email: string; initials: string; role: string };

function HomeModule({ title, action, onClick, children }: { title: string; action: string; onClick: () => void; children: React.ReactNode }) {
  return <article className="home-module"><header><h2>{title}</h2><button onClick={onClick}>{action}<ArrowRight/></button></header><div>{children}</div></article>;
}

function HomeEmpty({ icon, title, text, action, onClick }: { icon: React.ReactNode; title: string; text: string; action?: string; onClick?: () => void }) {
  return <article className="home-module home-empty"><header><h2>{title}</h2></header><div className="home-empty-body"><span>{icon}</span><p>{text}</p>{action && <button onClick={onClick}>{action}</button>}</div></article>;
}

function StatCard({ icon, value, title, detail, tone, onClick }: {
  icon: React.ReactNode; value: number; title: string; detail: string; tone: string; onClick: () => void;
}) {
  return <button className={`metric metric-${tone}`} onClick={onClick}>
    <span className="metric-icon">{icon}</span><span className="metric-copy"><strong>{value}</strong><small>{title}</small><em>{detail}</em></span>
  </button>;
}

const Icon = ({ children }: { children: React.ReactNode }) => {
  const icons: Record<string, React.ReactNode> = {
    "⌂": <House />, "⌕": <Search />, "✓": <Check />, "◷": <Clock />,
    "▤": <List />, "▦": <LayoutGrid />, "◇": <Star />, "?": <CircleHelp />,
  };
  return <span className="icon" aria-hidden="true">{icons[String(children)] ?? <Folder />}</span>;
};

const initialTasks: TaskItem[] = [
  { title: "Оновити порожні стани", project: "UZ Workspace", status: "Заплановано", due: "05 сер", priority: "Середній", owner: "КБ", collaborators: ["Каріна","Олена"], tags: ["дизайн","ux"] },
  { title: "Головна сторінка простору", project: "UZ Workspace", status: "В роботі", due: "Сьогодні", priority: "Високий", owner: "КБ", collaborators: ["Каріна","Андрій"], tags: ["workspace","frontend"] },
  { title: "Перевірити сценарій повернення", project: "Booking Web", status: "В роботі", due: "02 сер", priority: "Високий", owner: "ОМ", collaborators: ["Олена","Марія"], tags: ["booking","дослідження"] },
  { title: "Компоненти мобільного квитка", project: "МТКД Mobile", status: "На перевірці", due: "04 сер", priority: "Середній", owner: "АС", collaborators: ["Андрій"], tags: ["mobile","ui-kit"] },
  { title: "Підключити design tokens", project: "UZ Workspace", status: "Готово", due: "30 лип", priority: "Низький", owner: "КБ", collaborators: ["Каріна"], tags: ["design-system"] },
];

const initialWorkspacePeople: WorkspacePerson[] = [
  { id: "Каріна", name: "Каріна Барановська", email: "karina@uz.gov.ua", initials: "КБ", role: "UI/UX дизайнер" },
  { id: "Олена", name: "Олена Михайлюк", email: "olena@uz.gov.ua", initials: "ОМ", role: "Product manager" },
  { id: "Андрій", name: "Андрій Стеценко", email: "andrii@uz.gov.ua", initials: "АС", role: "Frontend developer" },
  { id: "Марія", name: "Марія Коваль", email: "maria@uz.gov.ua", initials: "МК", role: "Business analyst" },
  { id: "Іван", name: "Іван Бондар", email: "ivan@uz.gov.ua", initials: "ІБ", role: "Backend developer" },
  { id: "Наталія", name: "Наталія Шевченко", email: "nataliia@uz.gov.ua", initials: "НШ", role: "QA engineer" },
];

const projects = [
  { name: "UZ Workspace", team: "Цифрові продукти", progress: 72, color: "blue", icon: "workspace", meta: "18 сторінок · 6 учасників" },
  { name: "Booking Web", team: "Пасажирські сервіси", progress: 48, color: "orange", icon: "booking", meta: "12 сторінок · 9 учасників" },
  { name: "МТКД Mobile", team: "Мобільні застосунки", progress: 86, color: "navy", icon: "mobile", meta: "24 сторінки · 8 учасників" },
];

export default function Workspace() {
  const [view, setView] = useState<View>("home");
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("demo");
  const [workspaceScope, setWorkspaceScope] = useState<WorkspaceScope>("uz");
  const [workspaces, setWorkspaces] = useState([
    { id:"uz", name:"УЗ", title:"УЗ · Workspace", description:"Директорський workspace", initials:"УЗ" },
    { id:"personal", name:"Мій workspace", title:"Каріна · Workspace", description:"Приватні сторінки", initials:"КБ" },
  ]);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [scopeOpen, setScopeOpen] = useState(false);
  const [taskMode, setTaskMode] = useState<TaskView>("board");
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");
  const [taskFilterOpen, setTaskFilterOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [spaceModalOpen, setSpaceModalOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [commentsPanelOpen, setCommentsPanelOpen] = useState(false);
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [meetingJoinOpen, setMeetingJoinOpen] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("Product Sync");
  const [meetingDate, setMeetingDate] = useState("2026-07-30");
  const [meetingTime, setMeetingTime] = useState("15:30");
  const [meetingEnd, setMeetingEnd] = useState("16:15");
  const [meetingSpace, setMeetingSpace] = useState("Booking");
  const [meetingFormat, setMeetingFormat] = useState("Google Meet");
  const [meetingPeople, setMeetingPeople] = useState(["Каріна","Олена","Андрій"]);
  const [meetingDescription, setMeetingDescription] = useState("");
  const [stepsConverted, setStepsConverted] = useState(false);
  const [calendarMode, setCalendarMode] = useState<"month"|"week"|"day"|"list"|"mine">("month");
  const [calendarSpaceFilter, setCalendarSpaceFilter] = useState("Всі простори");
  const [calendarFilterOpen, setCalendarFilterOpen] = useState(false);
  const [taskCalendarMonth, setTaskCalendarMonth] = useState(1);
  const [docsMode, setDocsMode] = useState<"root"|"all"|"shared">("root");
  const [docsSort, setDocsSort] = useState<"updated"|"name"|"created">("updated");
  const [docsSortOpen, setDocsSortOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState("Каріна Барановська");
  const [pageTitle, setPageTitle] = useState("");
  const [pageCover, setPageCover] = useState<string | null>(null);
  const [pageIcon, setPageIcon] = useState("✨");
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [pageBlocks, setPageBlocks] = useState<BlockKind[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [widgetSettingsOpen, setWidgetSettingsOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(["Бриф Workspace.pdf","Структура даних.xlsx","Макети головної.fig"]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [slashOpen, setSlashOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState(initialTasks);
  const [toast, setToast] = useState("");
  const [newTask, setNewTask] = useState("");
  const [createTaskStatus, setCreateTaskStatus] = useState<TaskStatus>("Заплановано");
  const [createTaskDue, setCreateTaskDue] = useState("");
  const [createTaskPriority, setCreateTaskPriority] = useState("Середній");
  const [createTaskPeople, setCreateTaskPeople] = useState(["Каріна"]);
  const [createTaskTags, setCreateTaskTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [peopleQuery, setPeopleQuery] = useState("");
  const [workspacePeople, setWorkspacePeople] = useState(initialWorkspacePeople);
  const [teamInviteOpen, setTeamInviteOpen] = useState(false);
  const [teamInvitePeople, setTeamInvitePeople] = useState<string[]>([]);
  const [inboxFilter, setInboxFilter] = useState<"all"|"mentions"|"invites"|"approvals">("all");
  const [readInboxIds, setReadInboxIds] = useState<number[]>([]);
  const [pageFavorite, setPageFavorite] = useState(false);
  const [pageMenuOpen, setPageMenuOpen] = useState(false);
  const [documentBlocks, setDocumentBlocks] = useState<BlockKind[]>([]);
  const [inlineTableRows, setInlineTableRows] = useState(["Новий запис"]);
  const [inlineBoardCards, setInlineBoardCards] = useState<Record<string,string[]>>({"Заплановано":["Нова картка"],"В роботі":[],"Готово":[]});
  const [linkDraft, setLinkDraft] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [settingsPane, setSettingsPane] = useState<"profile"|"workspace"|"notifications">("profile");
  const [taskStatuses, setTaskStatuses] = useState([
    { name: "Заплановано", color: "gray" },
    { name: "В роботі", color: "blue" },
    { name: "На перевірці", color: "orange" },
    { name: "Готово", color: "green" },
  ]);
  const [statusMenuTask, setStatusMenuTask] = useState<string | null>(null);
  const [statusEditorOpen, setStatusEditorOpen] = useState(false);
  const [editingStatusName, setEditingStatusName] = useState<string | null>(null);
  const [statusDraftName, setStatusDraftName] = useState("");
  const [statusDraftColor, setStatusDraftColor] = useState("blue");
  const [activeTaskTitle, setActiveTaskTitle] = useState<string | null>(null);
  const [taskDescription, setTaskDescription] = useState("Додайте контекст, посилання, чекліст або вкладені матеріали.");
  const [newComment, setNewComment] = useState("");
  const [commentFilter, setCommentFilter] = useState<"open"|"mentions"|"resolved">("open");
  const [subtasks, setSubtasks] = useState(["Підготувати перший варіант","Передати на ревʼю"]);
  const [subtaskDraft, setSubtaskDraft] = useState("");
  const [subtaskComposerOpen, setSubtaskComposerOpen] = useState(false);
  const [shareQuery, setShareQuery] = useState("");
  const [pageAccessPeople, setPageAccessPeople] = useState(["Олена"]);
  const [projectFilter, setProjectFilter] = useState<"all"|"active"|"review">("all");
  const [fileType, setFileType] = useState<"all"|"docs"|"design"|"tables">("all");
  const [fileSearch, setFileSearch] = useState("");
  const [recentFilter, setRecentFilter] = useState<"all"|"pages"|"tasks"|"people">("all");
  const [trashedItems, setTrashedItems] = useState(["Чернетка ретро","Старі нотатки","Архів макетів"]);
  const [accessRequests, setAccessRequests] = useState([
    { id: 1, name: "Ірина Левченко", initials: "ІЛ", resource: "Дослідження Booking", access: "Редагування", status: "pending" },
    { id: 2, name: "Максим Руденко", initials: "МР", resource: "МТКД · Roadmap", access: "Перегляд", status: "pending" },
  ]);
  const [selectedQuote, setSelectedQuote] = useState<{ text: string; x: number; y: number } | null>(null);
  const [pageComments, setPageComments] = useState([
    { id: 1, author: "Олена Михайлюк", initials: "ОМ", text: "Додала уточнення до нотаток зустрічі.", time: "5 хв", resolved: false, quote: "Інформація має бути доступною за два кліки" },
    { id: 2, author: "Андрій Стеценко", initials: "АС", text: "Оновив посилання на робочі матеріали.", time: "42 хв", resolved: false, quote: "" },
  ]);
  const visibleTasks = useMemo(() => tasks.filter(task => {
    if (taskFilter === "today") return task.due === "Сьогодні";
    if (taskFilter === "urgent") return task.priority === "Високий" && task.status !== "Готово";
    if (taskFilter === "review") return task.status === "На перевірці";
    if (taskFilter === "mine") return task.collaborators.includes("Каріна");
    return true;
  }), [tasks, taskFilter]);
  const inboxItems = [
    { id:1, category:"invites", icon:Video, tone:"blue-soft", title:"Вас запросили на Product Sync", meta:"Booking / Зустрічі · сьогодні о 15:30", time:"5 хв", primary:"Прийняти", secondary:"Відхилити", target:"meeting" as View },
    { id:2, category:"approvals", icon:Stamp, tone:"orange-soft", title:"Документ очікує погодження", meta:"МТКД / ТЗ мобільного квитка", time:"18 хв", primary:"Перейти до документа", target:"document" as View },
    { id:3, category:"mentions", icon:MessageSquare, tone:"green-soft", title:"Олена згадала вас у коментарі", meta:"Booking / Робочі матеріали", time:"42 хв", primary:"Відповісти", target:"comments" as View },
    { id:4, category:"invites", icon:Users, tone:"violet-soft", title:"Вам надали доступ до простору", meta:"Інтер-Поліс · роль: редактор", time:"2 год", primary:"Відкрити простір", target:"teamspace" as View },
  ];
  const filteredInboxItems = inboxItems.filter(item => inboxFilter==="all" || item.category===inboxFilter);
  const unreadInboxCount = inboxItems.filter(item=>!readInboxIds.includes(item.id)).length;
  const activeTask = tasks.find(task => task.title === activeTaskTitle) || null;
  const currentWorkspace = workspaces.find(item=>item.id===workspaceScope) || workspaces[0];
  const taskCalendarMonths = ["Червень 2026","Липень 2026","Серпень 2026"];
  const filteredComments = pageComments.filter(comment=>commentFilter==="resolved"?comment.resolved:commentFilter==="open"?!comment.resolved:comment.text.includes("@")||comment.author!=="Каріна Барановська");
  const viewLabels: Record<View,string> = {
    home:"Головна", inbox:"Вхідні", calendar:"Календар", meeting:meetingTitle, tasks:"Задачі команди",
    document:pageTitle||"UZ Workspace", "new-page":pageTitle||"Без назви", teamspace:"Цифрові продукти",
    team:"Команда", member:selectedMember, docs:"Мій простір", comments:"Коментарі", profile:"Профіль",
    settings:"Налаштування", projects:"Проєкти", files:"Файли", recent:"Останні", trash:"Кошик",
    release:"Реліз МТКД", "access-requests":"Запити на доступ",
  };

  const showToast = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2200);
  };

  const results = useMemo(() => {
    const all = [
      { title: "UZ Workspace", sub: "Проєкт · Цифрові продукти", view: "home" as View },
      { title: "UZ Workspace", sub: "Спільна сторінка · Оновлено сьогодні", view: "document" as View },
      { title: "Задачі команди", sub: "База даних · 12 активних", view: "tasks" as View },
      { title: "Команда ЦІТ", sub: "7 учасників", view: "team" as View },
    ];
    return all.filter(item => `${item.title} ${item.sub}`.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const go = (next: View) => { setView(next); setSearchOpen(false); };
  const openDocument = (title: string) => { setPageTitle(title); go("document"); };
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { title: newTask, project: "UZ Workspace", status: createTaskStatus, due: createTaskDue || "Без терміну", priority: createTaskPriority, owner: "КБ", collaborators: createTaskPeople, tags: createTaskTags }]);
    setNewTask(""); setCreateTaskTags([]); setTagDraft(""); setPeopleQuery(""); setCreateOpen(false); setView("tasks"); showToast("Задачу додано");
  };
  const updateTaskStatus = (title: string, status: TaskStatus) => {
    setTasks(current => current.map(task => task.title === title ? { ...task, status } : task));
    setStatusMenuTask(null);
    showToast(`Статус змінено на «${status}»`);
  };
  const updateTaskPriority = (title: string, priority: string) => {
    setTasks(current => current.map(task => task.title === title ? { ...task, priority } : task));
    showToast(`Пріоритет змінено на «${priority}»`);
  };
  const updateTaskDue = (title: string, due: string) => {
    setTasks(current => current.map(task => task.title === title ? { ...task, due: due || "Без терміну" } : task));
    showToast(due ? "Термін оновлено" : "Термін прибрано");
  };
  const toggleTaskPerson = (title: string, person: string) => {
    setTasks(current => current.map(task => task.title !== title ? task : { ...task, collaborators: task.collaborators.includes(person) ? task.collaborators.filter(item => item !== person) : [...task.collaborators, person] }));
  };
  const addTaskTag = (title: string, value: string) => {
    const tag = value.trim().replace(/^#+/, "").replace(/\s+/g, "-").toLowerCase();
    if (!tag) return;
    setTasks(current => current.map(task => task.title !== title || task.tags.includes(tag) ? task : { ...task, tags: [...task.tags, tag] }));
    setTagDraft("");
  };
  const removeTaskTag = (title: string, tag: string) => {
    setTasks(current => current.map(task => task.title !== title ? task : { ...task, tags: task.tags.filter(item => item !== tag) }));
  };
  const duplicateTask = (title: string) => {
    const source = tasks.find(task => task.title === title);
    if (!source) return;
    const copy = { ...source, title: `${source.title} — копія`, collaborators: [...source.collaborators] };
    setTasks(current => [...current, copy]);
    setActiveTaskTitle(copy.title);
    showToast("Задачу продубльовано");
  };
  const deleteTask = (title: string) => {
    setTasks(current => current.filter(task => task.title !== title));
    setActiveTaskTitle(null);
    showToast("Задачу переміщено в кошик");
  };
  const priorityClass = (priority: string) => `priority-select priority-${priority === "Високий" ? "high" : priority === "Низький" ? "low" : "medium"}`;
  const taskPriorityPicker = (task: (typeof tasks)[number]) => <select className={priorityClass(task.priority)} aria-label={`Пріоритет задачі ${task.title}`} value={task.priority} onChange={e=>updateTaskPriority(task.title,e.target.value)}><option>Низький</option><option>Середній</option><option>Високий</option></select>;
  const personById = (id: string) => workspacePeople.find(person => person.id === id);
  const taskPeopleTags = (task: TaskItem) => <div className="task-people-tags">{task.collaborators.map(id=>{const person=personById(id);return <span className="person-chip" key={id}><i>{person?.initials || id.slice(0,2).toUpperCase()}</i>{person?.name.split(" ")[0] || id}</span>})}</div>;
  const taskHashtags = (task: TaskItem) => <div className="task-hashtags">{(task.tags||[]).map(tag=><span key={tag}>#{tag}</span>)}</div>;
  const filteredPeople = workspacePeople.filter(person => `${person.name} ${person.email} ${person.role}`.toLowerCase().includes(peopleQuery.trim().toLowerCase()));
  const canInviteEmail = peopleQuery.includes("@") && !workspacePeople.some(person => person.email.toLowerCase() === peopleQuery.trim().toLowerCase());
  const inviteWorkspacePerson = (email: string, select: (id: string) => void) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return showToast("Перевірте адресу пошти");
    const local = cleanEmail.split("@")[0].replace(/[._-]+/g, " ");
    const displayName = local.split(" ").filter(Boolean).map(part => part[0]?.toUpperCase()+part.slice(1)).join(" ") || cleanEmail;
    const id = cleanEmail;
    const person = { id, name: displayName, email: cleanEmail, initials: displayName.split(" ").map(part=>part[0]).join("").slice(0,2).toUpperCase(), role: "Запрошення очікується" };
    setWorkspacePeople(current => [...current, person]);
    select(id);
    setPeopleQuery("");
    showToast(`Запрошення надіслано: ${cleanEmail}`);
  };
  const peoplePicker = (selected: string[], toggle: (id: string) => void) => <div className="people-property">
    <div className="people-search"><Search/><input value={peopleQuery} onChange={event=>setPeopleQuery(event.target.value)} placeholder="Знайти за ім’ям або корпоративною поштою"/></div>
    <div className="people-options">{filteredPeople.map(person=><button type="button" className={selected.includes(person.id)?"active":""} key={person.id} onClick={()=>toggle(person.id)}><span className="avatar mini">{person.initials}</span><span><strong>{person.name}</strong><small>{person.email} · {person.role}</small></span>{selected.includes(person.id)?<Check/>:<Plus/>}</button>)}
      {canInviteEmail&&<button type="button" className="invite-person" onClick={()=>inviteWorkspacePerson(peopleQuery,toggle)}><span className="invite-person-icon"><UserPlus/></span><span><strong>Запросити за поштою</strong><small>{peopleQuery.trim()}</small></span><ArrowRight/></button>}
      {!filteredPeople.length&&!canInviteEmail&&<p>Нікого не знайдено. Введіть корпоративну пошту, щоб запросити людину.</p>}
    </div>
  </div>;
  const openStatusEditor = (name?: string) => {
    const current = taskStatuses.find(status => status.name === name);
    setEditingStatusName(name || null);
    setStatusDraftName(current?.name || "");
    setStatusDraftColor(current?.color || "blue");
    setStatusMenuTask(null);
    setStatusEditorOpen(true);
  };
  const saveStatus = () => {
    const name = statusDraftName.trim();
    if (!name) return;
    if (editingStatusName) {
      setTaskStatuses(current => current.map(status => status.name === editingStatusName ? { name, color: statusDraftColor } : status));
      setTasks(current => current.map(task => task.status === editingStatusName ? { ...task, status: name } : task));
    } else if (!taskStatuses.some(status => status.name.toLowerCase() === name.toLowerCase())) {
      setTaskStatuses(current => [...current, { name, color: statusDraftColor }]);
    }
    setStatusEditorOpen(false);
    showToast(editingStatusName ? "Статус оновлено" : "Новий статус і колонку створено");
  };
  const statusColor = (name: string) => taskStatuses.find(status => status.name === name)?.color || "gray";
  const taskStatusPicker = (task: (typeof tasks)[number], context = "main") => <div className="status-picker">
    <button className={`notion-status tone-${statusColor(task.status)}`} onClick={()=>{const key=`${task.title}:${context}`;setStatusMenuTask(statusMenuTask===key?null:key)}}><i/>{task.status}<ChevronDown/></button>
    {statusMenuTask===`${task.title}:${context}`&&<div className="status-menu"><p>Статус</p>{taskStatuses.map(status=><div className="status-option" key={status.name}><button onClick={()=>updateTaskStatus(task.title,status.name)}><span className={`status-color tone-${status.color}`}><i/></span><strong>{status.name}</strong>{task.status===status.name&&<Check/>}</button><button aria-label={`Редагувати ${status.name}`} onClick={()=>openStatusEditor(status.name)}><Ellipsis/></button></div>)}<button className="add-status-option" onClick={()=>openStatusEditor()}><Plus/> Новий статус</button></div>}
  </div>;
  const addComment = () => {
    if (!newComment.trim()) return;
    setPageComments(current => [{ id: Date.now(), author: "Каріна Барановська", initials: "КБ", text: newComment.trim(), time: "щойно", resolved: false, quote: selectedQuote?.text || "" }, ...current]);
    setNewComment("");
    setSelectedQuote(null);
    showToast("Коментар додано");
  };
  const resolveComment = (id: number) => {
    setPageComments(current => current.map(comment => comment.id === id ? { ...comment, resolved: !comment.resolved } : comment));
  };
  const captureSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (!selection || !text || selection.rangeCount === 0) return setSelectedQuote(null);
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    setSelectedQuote({ text: text.slice(0, 240), x: Math.min(window.innerWidth - 76, Math.max(18, rect.right)), y: Math.max(72, rect.top - 48) });
  };
  const quickCreate = (label: string, target: View = "document") => {
    setQuickMenuOpen(false);
    go(target);
    showToast(`${label} створено`);
  };
  const openTaskView = (filter: TaskFilter, mode: TaskView = "table") => {
    setTaskFilter(filter); setTaskMode(mode); setView("tasks");
  };
  const createBlankPage = () => {
    setPageTitle(""); setPageCover(null); setPageBlocks([]); setWorkspaceMode("demo"); setView("new-page");
  };
  const addPageBlock = (kind: BlockKind) => {
    setPageBlocks(current => [...current, kind]); setSlashOpen(false); showToast("Блок додано");
  };
  const addDocumentBlock = (kind: BlockKind) => {
    setDocumentBlocks(current=>[...current,kind]); setSlashOpen(false); showToast("Блок додано до сторінки");
  };
  const movePageBlockUp = (index: number) => {
    if (index===0) return showToast("Це вже перший блок");
    setPageBlocks(current=>{const next=[...current];[next[index-1],next[index]]=[next[index],next[index-1]];return next});
    showToast("Блок переміщено вище");
  };
  const markInboxRead = (id: number, target?: View) => {
    setReadInboxIds(current=>current.includes(id)?current:[...current,id]);
    if(target) go(target);
  };
  const openMember = (name: string) => { setSelectedMember(name); setView("member"); };
  const statusClass = (status: string) =>
    `status-pill status-${status === "Готово" ? "done" : status === "В роботі" ? "active" : status === "На перевірці" ? "review" : status.includes("Блокер") ? "blocked" : "planned"}`;

  return (
    <div className={sidebarCollapsed ? "shell sidebar-collapsed" : "shell"}>
      <aside className="sidebar">
        <div className="sidebar-header-row"><button className="brand" onClick={() => setScopeOpen(!scopeOpen)}>
          <span className="brandmark"><span>{currentWorkspace.initials}</span></span>
          <span><strong>{currentWorkspace.title}</strong><small>{currentWorkspace.description}</small></span>
          <span className={scopeOpen ? "chev open" : "chev"}><ChevronDown /></span>
        </button><button className="sidebar-trigger" aria-label={sidebarCollapsed ? "Розгорнути sidebar" : "Згорнути sidebar"} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>{sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}</button></div>
        {scopeOpen && <div className="scope-switch">
          <p className="scope-menu-label">Ваші workspace</p>
          {workspaces.map(workspace=><button className={workspaceScope===workspace.id?"active":""} key={workspace.id} onClick={()=>{setWorkspaceScope(workspace.id);setScopeOpen(false);go("home");showToast(`Відкрито ${workspace.name}`)}}><span>{workspace.initials}</span><div><strong>{workspace.name}</strong><small>{workspace.description}</small></div>{workspaceScope===workspace.id&&<Check/>}</button>)}
          <div className="scope-menu-divider"/>
          <button className="scope-menu-action" onClick={()=>{setScopeOpen(false);setWorkspaceModalOpen(true)}}><span><Plus/></span><div><strong>Створити workspace</strong><small>Новий окремий робочий простір</small></div><ArrowRight/></button>
          <button className="scope-menu-action" onClick={()=>{setScopeOpen(false);setSettingsPane("workspace");go("settings")}}><span><Settings/></span><div><strong>Налаштування workspace</strong><small>Назва, учасники та доступ</small></div><ArrowRight/></button>
          <button className="scope-menu-action" onClick={()=>{setScopeOpen(false);setSettingsPane("profile");go("profile")}}><span><Users/></span><div><strong>Мій профіль</strong><small>Фото та персональні дані</small></div><ArrowRight/></button>
        </div>}

        <nav>
          <p className="nav-label">Workspace</p>
          <button className={view === "home" ? "nav active" : "nav"} onClick={() => go("home")}><Icon>⌂</Icon> Головна</button>
          <button className={view === "tasks" ? "nav active" : "nav"} onClick={() => openTaskView("all")}><ListTodo /> Загальні задачі</button>
          <button className={view === "projects" ? "nav active" : "nav"} onClick={() => go("projects")}><Folder /> Проєкти</button>
          <button className={view === "inbox" ? "nav active" : "nav"} onClick={() => go("inbox")}><Bell /> Вхідні {unreadInboxCount>0&&<span className="nav-count">{unreadInboxCount}</span>}</button>
          <button className={view === "calendar" ? "nav active" : "nav"} onClick={() => go("calendar")}><CalendarDays /> Календар</button>
          <button className="nav" onClick={() => setSearchOpen(true)}><Icon>⌕</Icon> Пошук <kbd>⌘ K</kbd></button>

          <p className="nav-label">Сторінки</p>
          <button className={view === "docs" && docsMode === "root" ? "nav active" : "nav"} onClick={() => {setDocsMode("root");go("docs")}}><FileText /> Мої сторінки <Ellipsis className="more-icon" /></button>
          <button className={view === "docs" && docsMode === "shared" ? "nav active" : "nav"} onClick={() => {setDocsMode("shared");go("docs")}}><Share2 /> Спільні зі мною <Ellipsis className="more-icon" /></button>
          <button className={view === "recent" ? "nav active" : "nav"} onClick={() => go("recent")}><Clock /> Останні</button>
          <button className={view === "files" ? "nav active" : "nav"} onClick={() => go("files")}><Paperclip /> Файли</button>
          <button className="nav add-page-nav" onClick={createBlankPage}><Plus /> Нова сторінка</button>

          <p className="nav-label">Спільні простори</p>
          <button className={view === "teamspace" ? "nav active" : "nav"} onClick={() => go("teamspace")}><span className="team-dot blue-dot">Ц</span> Цифрові продукти <Ellipsis className="more-icon" /></button>
          <button className="nav" onClick={() => openDocument("Пасажирські сервіси")}><span className="team-dot orange-dot">П</span> Пасажирські сервіси <Ellipsis className="more-icon" /></button>
          <button className="nav" onClick={() => openDocument("Мобільні застосунки")}><span className="team-dot green-dot">М</span> Мобільні застосунки <Ellipsis className="more-icon" /></button>
          <button className="nav add-page-nav" onClick={() => setSpaceModalOpen(true)}><Plus /> Створити спільний простір</button>
          <p className="nav-label">Обране</p>
          <button className="nav" onClick={()=>go("document")}><Star/> ТЗ авторизації</button>
        </nav>

        <div className="sidebar-bottom">
          <p className="nav-label utility-label">Інструменти</p>
          <button className="nav" onClick={()=>setTemplateOpen(true)}><LayoutGrid/> Шаблони</button>
          <button className={view==="trash"?"nav active":"nav"} onClick={()=>go("trash")}><Archive/> Кошик</button>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div className="top-left"><div className="crumb"><span>{currentWorkspace.title}</span><b>/</b><strong>{viewLabels[view]}</strong></div></div>
          <div className="top-actions">
            <div className="workspace-switch" aria-label="Стан даних"><button className={workspaceMode === "empty" ? "active" : ""} onClick={() => { setWorkspaceMode("empty"); setView("home"); }}>Без даних</button><button className={workspaceMode === "demo" ? "active" : ""} onClick={() => setWorkspaceMode("demo")}>З даними</button></div>
            <button className="icon-button mobile-search" aria-label="Пошук" onClick={() => setSearchOpen(true)}><Search /></button>
            <div className="relative"><button className="icon-button has-dot" aria-label="Сповіщення" onClick={() => setNoticeOpen(!noticeOpen)}><Bell /></button>
              {noticeOpen && <div className="popover notifications"><div className="popover-title">Сповіщення <span>3 нових</span></div><button className="notice" onClick={() => { setNoticeOpen(false); go("document"); }}><span className="avatar mini">ОМ</span><p><strong>Олена залишила коментар</strong><small>Головна сторінка простору · 5 хв</small></p></button><button className="notice" onClick={() => { setNoticeOpen(false); go("tasks"); }}><span className="notice-icon"><Check /></span><p><strong>Задачу переміщено в «Готово»</strong><small>Design tokens · учора</small></p></button></div>}
            </div>
            <div className="relative"><Button onClick={() => setQuickMenuOpen(!quickMenuOpen)}><Plus /> Створити <ChevronDown /></Button>
              {quickMenuOpen && <div className="quick-create-menu">
                <div className="quick-menu-label">Створити нове</div>
                <button onClick={() => { setQuickMenuOpen(false); createBlankPage(); }}><span><FilePlus2 /></span><div><strong>Сторінка</strong><small>Чистий документ або шаблон</small></div></button>
                <button onClick={() => { setQuickMenuOpen(false); setCreateOpen(true); }}><span><CheckCircle2 /></span><div><strong>Задача</strong><small>Додати до командної бази</small></div></button>
                <button onClick={() => { setQuickMenuOpen(false); setMeetingModalOpen(true); }}><span><BookOpenCheck /></span><div><strong>Зустріч</strong><small>Час, учасники та порядок денний</small></div></button>
                <button onClick={() => { setQuickMenuOpen(false); setSpaceModalOpen(true); }}><span><Users /></span><div><strong>Спільний простір</strong><small>Створити й запросити учасників</small></div></button>
                <button onClick={() => { setQuickMenuOpen(false); setUploadModalOpen(true); }}><span><Upload /></span><div><strong>Завантажити файл</strong><small>Додати до поточного простору</small></div></button>
              </div>}
            </div>
          </div>
        </header>

        {workspaceMode === "empty" && view === "home" && <section className="content personal-home">
          <div className="welcome"><div><span className="eyebrow">ПЕРСОНАЛЬНА ГОЛОВНА</span><h1>Добрий день, Каріно <span>👋</span></h1><p>Усе спокійно — нових подій у доступних просторах немає.</p></div><button className="secondary-action" onClick={()=>setWidgetSettingsOpen(true)}><Settings/> Налаштувати</button></div>
          <div className="home-summary"><button onClick={()=>setCreateOpen(true)}><strong>0</strong><span>задач сьогодні</span></button><button onClick={()=>go("calendar")}><strong>0</strong><span>зустрічей</span></button><button onClick={()=>go("comments")}><strong>0</strong><span>нових згадок</span></button><button onClick={()=>go("access-requests")}><strong>0</strong><span>запитів на доступ</span></button></div>
          <div className="home-modules">
            <HomeEmpty icon={<CalendarDays/>} title="Сьогодні" text="На сьогодні немає задач і зустрічей." action="Створити задачу" onClick={()=>setCreateOpen(true)}/>
            <HomeEmpty icon={<ListTodo/>} title="Мої задачі" text="У вас поки немає активних задач." action="Перейти до задач" onClick={()=>go("tasks")}/>
            <HomeEmpty icon={<BookOpenCheck/>} title="Зустрічі" text="Найближчих зустрічей немає." action="Створити зустріч" onClick={()=>setMeetingModalOpen(true)}/>
            <HomeEmpty icon={<Bell/>} title="Вхідні" text="Нових коментарів і згадок немає."/>
            <HomeEmpty icon={<Clock/>} title="Останні сторінки" text="Ви ще не відкривали сторінки." action="Створити сторінку" onClick={createBlankPage}/>
            <HomeEmpty icon={<Users/>} title="Мої простори" text="Вас ще не додали до спільних просторів." action="Створити простір" onClick={()=>setSpaceModalOpen(true)}/>
          </div>
        </section>}

        {workspaceMode === "demo" && view === "home" && <section className="content personal-home">
          <div className="welcome"><div><span className="eyebrow">ПЕРСОНАЛЬНА ГОЛОВНА</span><h1>Добрий день, Каріно <span>👋</span></h1><p>Огляд подій з всіх просторів, до яких ви маєте доступ.</p></div><button className="secondary-action" onClick={()=>setWidgetSettingsOpen(true)}><Settings/> Налаштувати</button></div>
          <div className="home-summary"><button onClick={()=>openTaskView("today")}><strong>3</strong><span>задачі сьогодні</span></button><button onClick={()=>go("meeting")}><strong>1</strong><span>зустріч</span></button><button onClick={()=>go("comments")}><strong>2</strong><span>нові згадки</span></button><button onClick={()=>go("access-requests")}><strong>1</strong><span>запит на доступ</span></button></div>
          <div className="home-modules">
            <HomeModule title="Сьогодні" action="Відкрити календар" onClick={()=>go("calendar")}><button className="home-item" onClick={()=>openTaskView("today")}><span className="home-time">Сьогодні</span><span><strong>Підготувати макети для review</strong><small>Цифрові продукти / Задачі команди</small></span><ArrowRight/></button><button className="home-item" onClick={()=>go("meeting")}><span className="home-time">15:30</span><span><strong>Product Sync</strong><small>Booking / Зустрічі</small></span><ArrowRight/></button></HomeModule>
            <HomeModule title="Мої задачі" action="Всі задачі" onClick={()=>go("tasks")}>{tasks.slice(0,3).map(task=><button className="home-item" key={task.title} onClick={()=>go("tasks")}><span className={statusClass(task.status)}><i/></span><span><strong>{task.title}</strong><small>{task.project} · {task.due}</small></span><ArrowRight/></button>)}</HomeModule>
            <HomeModule title="Зустрічі" action="Створити" onClick={()=>setMeetingModalOpen(true)}><button className="home-item" onClick={()=>go("meeting")}><span className="home-date"><b>30</b>лип</span><span><strong>Product Sync</strong><small>15:30 · Booking · 6 учасників</small></span><ArrowRight/></button></HomeModule>
            <HomeModule title="Вхідні" action="Переглянути" onClick={()=>go("inbox")}><button className="home-item" onClick={()=>go("comments")}><span className="avatar mini">ОМ</span><span><strong>Олена згадала вас у коментарі</strong><small>Booking / Робочі матеріали · 5 хв</small></span><ArrowRight/></button><button className="home-item" onClick={()=>go("access-requests")}><span className="home-inbox-icon"><Users/></span><span><strong>Запит на доступ до сторінки</strong><small>МТКД / План релізу · 18 хв</small></span><ArrowRight/></button></HomeModule>
            <HomeModule title="Останні сторінки" action="Всі останні" onClick={()=>go("recent")}>{["Booking / ТЗ авторизації","МТКД / FAQ","Мій простір / Чернетки"].map(name=><button className="home-item" key={name} onClick={()=>openDocument(name)}><FileText/><span><strong>{name}</strong><small>Оновлено сьогодні</small></span><ArrowRight/></button>)}</HomeModule>
            <HomeModule title="Мої простори" action="Створити простір" onClick={()=>setSpaceModalOpen(true)}>{[["Booking","12 учасників · редактор"],["МТКД","8 учасників · перегляд"],["Цифрові продукти","6 учасників · адміністратор"]].map(([name,meta],i)=><button className="home-space" key={name} onClick={()=>go("teamspace")}><span className={`team-dot ${i===0?"orange-dot":i===1?"green-dot":"blue-dot"}`}>{name[0]}</span><span><strong>{name}</strong><small>{meta}<br/>Оновлено 8 хв тому</small></span><ArrowRight/></button>)}</HomeModule>
            {workspaceScope==="uz" && <HomeModule title="Спільні зі мною" action="Всі сторінки" onClick={()=>{setDocsMode("shared");go("docs")}}>{["Чернетка ТЗ|Олена Михайлюк|Перегляд","План дослідження|Андрій Стеценко|Редагування","Нотатки до зустрічі|Марія Коваль|Коментування"].map((item,i)=>{const[n,owner,access]=item.split("|");return <button className="home-item" key={n} onClick={()=>go("document")}><FileText/><span><strong>{n}</strong><small>{owner} · {access}</small></span><ArrowRight/></button>})}</HomeModule>}
            {workspaceScope==="personal" && <HomeModule title="Мої приватні сторінки" action="Відкрити простір" onClick={()=>go("docs")}>{["Чернетки","Особисті проєкти","Нотатки"].map(name=><button className="home-item" key={name} onClick={()=>go("docs")}><FileText/><span><strong>{name}</strong><small>Приватно · лише ви</small></span><ArrowRight/></button>)}</HomeModule>}
          </div>
        </section>}

        {false && view === "home" && <section className="content home-view">
          <div className="welcome">
            <div><span className="eyebrow">ЧЕТВЕР, 30 ЛИПНЯ</span><h1>Добрий день, Каріно <span>👋</span></h1><p>Ось що потребує вашої уваги сьогодні.</p></div>
          </div>

          <div className="smart-actions">
            <button onClick={() => quickCreate("Нотатку зустрічі")}><span className="smart-icon"><BookOpenCheck /></span><span><strong>Нотатка зустрічі</strong><small>Почати з командного шаблону</small></span><ArrowRight /></button>
            <button onClick={() => quickCreate("Рішення")}><span className="smart-icon"><Gavel /></span><span><strong>Зафіксувати рішення</strong><small>Контекст, власник і дата перегляду</small></span><ArrowRight /></button>
            <button onClick={() => { setNewTask("Блокер: "); setCreateOpen(true); }}><span className="smart-icon warning"><Archive /></span><span><strong>Додати блокер</strong><small>Підсвітити ризик для команди</small></span><ArrowRight /></button>
          </div>

          <div className="metric-row">
            <StatCard icon={<ListTodo />} value={8} title="Задач сьогодні" detail="Відкрити список на сьогодні" tone="blue" onClick={() => openTaskView("today")} />
            <StatCard icon={<Stamp />} value={4} title="Очікують ревʼю" detail="Статус: на перевірці" tone="orange" onClick={() => openTaskView("review")} />
            <StatCard icon={<MessagesSquare />} value={17} title="Нових коментарів" detail="5 особистих згадок" tone="green" onClick={() => go("comments")} />
            <StatCard icon={<Activity />} value={2} title="Термінові задачі" detail="Пріоритет: високий" tone="violet" onClick={() => openTaskView("urgent")} />
          </div>

          <div className="section-title quick-title"><div><h2>Швидкий доступ</h2><p>Корпоративні системи та сервіси команди</p></div><button className="text-button" onClick={() => setWidgetSettingsOpen(true)}>Налаштувати <ArrowRight /></button></div>
          <div className="system-grid">
            {[
              ["Booking","Квитки та пасажирські сервіси","booking"],
              ["МТКД","Мобільні цифрові канали","mtkd"],
              ["MIV","Аналітика та показники","miv"],
              ["Документи","Корпоративний документообіг","docs"],
              ["Підтримка","Запити та інциденти","support"],
              ["Календар","Події команди","calendar"],
            ].map(([name,desc,type]) => <button key={name} onClick={() => type==="calendar"?go("calendar"):type==="support"?go("inbox"):openDocument(String(name))}><span className={`system-icon ${type}`}>{type === "booking" ? <CalendarDays /> : type === "mtkd" ? <Gauge /> : type === "miv" ? <TrendingUp /> : type === "docs" ? <FileText /> : type === "support" ? <MessageSquare /> : <CalendarDays />}</span><span><strong>{name}</strong><small>{desc}</small></span><ArrowRight /></button>)}
          </div>

          <div className="section-title"><div><h2>Ваші проєкти</h2><p>Швидкий доступ до активної роботи</p></div><button className="text-button" onClick={() => showToast("Показано всі проєкти")}>Всі проєкти <ArrowRight /></button></div>
          <div className="project-grid">
            {projects.map(project => <button className="project-card" key={project.name} onClick={() => openDocument(project.name)}>
              <div className={`project-cover ${project.color}`}><span className="project-symbol">{project.icon === "workspace" ? <PanelTop /> : project.icon === "booking" ? <CalendarDays /> : <Gauge />}</span><span className="project-team">{project.team}</span><span className="project-menu"><Ellipsis /></span></div>
              <div className="project-body"><div className="project-heading"><h3>{project.name}</h3><span className="project-status"><i /> Активний</span></div><p>{project.meta}</p><div className="progress-line"><span style={{width: `${project.progress}%`}} /></div><div className="project-foot"><span>Прогрес</span><strong>{project.progress}%</strong></div></div>
            </button>)}
          </div>

          <div className="section-title compact-title"><div><h2>Останні та обрані</h2><p>Продовжуйте з місця, де зупинилися</p></div></div>
          <div className="recent-grid">
            {[
              ["UZ Workspace","Сьогодні, 14:31","favorite"],
              ["Зустріч команди · 30 липня","Сьогодні, 11:08","favorite"],
              ["Booking · Робочі матеріали","Учора, 17:42","recent"],
              ["Чернетка","28 липня","recent"],
            ].map(([name,time,kind]) => <button key={name} onClick={() => openDocument(name)}><span className="recent-file"><FileText /></span><span><strong>{name}</strong><small>{time}</small></span>{kind === "favorite" ? <Star className="starred" /> : <Clock />}</button>)}
          </div>

          <div className="lower-grid">
            <article className="panel">
              <div className="panel-head"><div><h2>Мої задачі</h2><p>Найближчі дедлайни</p></div><button onClick={() => go("tasks")}>Переглянути всі</button></div>
              {tasks.slice(0,3).map(task => <div className="task-row" key={task.title}><button className="check" aria-label="Завершити задачу" onClick={(e) => { e.currentTarget.classList.toggle("checked"); showToast("Статус оновлено"); }}><Check /></button><div><strong>{task.title}</strong><small>{task.project}</small></div><span className={task.due === "Сьогодні" ? "date today" : "date"}>{task.due}</span><span className="avatar mini">{task.owner}</span></div>)}
            </article>
            <article className="panel activity-panel">
              <div className="panel-head"><div><h2>Останні оновлення</h2><p>У ваших командах</p></div></div>
              <div className="activity"><span className="avatar mini">ОМ</span><p><strong>Олена Михайлюк</strong> додала коментар у <b>Booking Web</b><small>12 хв тому</small></p></div>
              <div className="activity"><span className="activity-icon green-soft"><CheckCircle2 /></span><p><strong>Андрій С.</strong> завершив задачу <b>Компоненти картки</b><small>1 год тому</small></p></div>
              <div className="activity"><span className="activity-icon blue-soft"><FileText /></span><p><strong>Ви</strong> оновили сторінку <b>Дизайн-система</b><small>3 год тому</small></p></div>
            </article>
          </div>
        </section>}

        {workspaceMode === "demo" && view === "inbox" && <section className="content inbox-page">
          <div className="page-head"><div><span className="eyebrow">ВХІДНІ</span><h1>Оновлення</h1><p>Події з всіх доступних просторів</p></div><button className="secondary-action" disabled={unreadInboxCount===0} onClick={()=>{setReadInboxIds(inboxItems.map(item=>item.id));showToast("Усе позначено прочитаним")}}><Check/> Прочитати все</button></div>
          <div className="inbox-layout"><aside>{[["all","Всі"],["mentions","Згадки"],["invites","Запрошення"],["approvals","Погодження"]].map(([filter,label])=><button key={filter} className={inboxFilter===filter?"active":""} onClick={()=>setInboxFilter(filter as typeof inboxFilter)}>{label}<span>{filter==="all"?inboxItems.length:inboxItems.filter(item=>item.category===filter).length}</span></button>)}</aside><div className="inbox-list">
            {filteredInboxItems.map(item=>{const InboxIcon=item.icon;const isRead=readInboxIds.includes(item.id);return <article className={isRead?"read":""} key={item.id}><span className={`inbox-type ${item.tone}`}><InboxIcon/></span><div><strong>{item.title}</strong><p>{item.meta}</p><div><button onClick={()=>{markInboxRead(item.id,item.target);showToast(item.primary==="Прийняти"?"Запрошення прийнято":"Відкрито")}}>{item.primary}</button>{item.secondary&&<button onClick={()=>{setReadInboxIds(current=>current.includes(item.id)?current:[...current,item.id]);showToast("Запрошення відхилено")}}>{item.secondary}</button>}</div></div><small>{isRead?"Прочитано":item.time}</small></article>})}
            {!filteredInboxItems.length&&<div className="inbox-empty"><CheckCircle2/><strong>Тут поки порожньо</strong><p>Нові події з’являться автоматично.</p></div>}
          </div></div>
        </section>}

        {workspaceMode === "demo" && view === "calendar" && <section className="content calendar-page">
          <div className="page-head"><div><span className="eyebrow">РОБОЧИЙ КАЛЕНДАР</span><h1>Липень 2026</h1><p>Події, зустрічі й дедлайни з всіх доступних просторів</p></div><Button onClick={()=>setMeetingModalOpen(true)}><Plus/> Створити зустріч</Button></div>
          <div className="calendar-tools"><div className="segmented">{[["month","Місяць"],["week","Тиждень"],["day","День"],["list","Список"],["mine","Мій розклад"]].map(([mode,label])=><button key={mode} className={calendarMode===mode?"active":""} onClick={()=>setCalendarMode(mode as typeof calendarMode)}>{label}</button>)}</div><div className="db-actions"><div className="relative calendar-filter-control"><button onClick={() => setCalendarFilterOpen(current=>!current)}><Filter/> {calendarSpaceFilter}<ChevronDown/></button>{calendarFilterOpen&&<div className="calendar-filter-menu">{["Всі простори","Booking","МТКД","Цифрові продукти"].map(space=><button className={calendarSpaceFilter===space?"active":""} key={space} onClick={()=>{setCalendarSpaceFilter(space);setCalendarFilterOpen(false)}}>{space}{calendarSpaceFilter===space&&<Check/>}</button>)}</div>}</div><button onClick={() => setCalendarMode("mine")}><Users/> Мої події</button></div></div>
          {calendarMode==="list"||calendarMode==="mine"?<div className="event-list">{[
            [Video,"Product Sync","15:30–16:15","Booking · Зустріч"],
            [Flag,"Макети на погодження","до 18:00","Цифрові продукти · Дедлайн"],
            [Rocket,"Реліз мобільного квитка","2 серпня","МТКД · Реліз"],
          ].map(([EventIcon,title,time,meta])=><button key={String(title)} onClick={()=>String(title).includes("Реліз")?go("release"):String(title).includes("Макети")?go("tasks"):go("meeting")}><span><EventIcon/></span><b>{String(time)}</b><div><strong>{String(title)}</strong><small>{String(meta)}</small></div><ArrowRight/></button>)}</div>:<div className={`work-calendar mode-${calendarMode}`}><div className="calendar-weekdays">{["Пн","Вт","Ср","Чт","Пт","Сб","Нд"].map(x=><b key={x}>{x}</b>)}</div><div className="calendar-days">{Array.from({length:35},(_,i)=>i+1).map(day=><div key={day} className={day===30?"today":day>31?"outside":""}><span>{day<=31?day:""}</span>{day===30&&<><button className="event meeting" onClick={()=>go("meeting")}><Video/> 15:30 Product Sync</button><button className="event deadline" onClick={()=>go("tasks")}><Flag/> Макети на review</button></>}{day===2&&<button className="event release" onClick={()=>go("release")}><Rocket/> Реліз МТКД</button>}</div>)}</div></div>}
        </section>}

        {workspaceMode === "demo" && view === "meeting" && <section className="content meeting-page">
          <div className="meeting-head"><span className="meeting-icon"><Video/></span><div><span className="eyebrow">ЗУСТРІЧ · {meetingSpace.toUpperCase()}</span><h1>{meetingTitle}</h1><p>{meetingDate} · {meetingTime}–{meetingEnd} · Europe/Kyiv</p></div><Button onClick={()=>setMeetingJoinOpen(true)}><Video/> Приєднатися</Button></div>
          <div className="meeting-properties"><div><span>Організатор</span><b><span className="avatar mini">КБ</span> Каріна Барановська</b></div><div><span>Учасники</span><b>{meetingPeople.map(id=>personById(id)?.initials||id.slice(0,2)).join(" · ") || "Не додані"}</b></div><div><span>Простір</span><b>{meetingSpace}</b></div><div><span>Формат</span><b>{meetingFormat}</b></div></div>
          <div className="meeting-body"><h2>Порядок денний</h2>{meetingDescription?<p>{meetingDescription}</p>:<ol><li>Статус поточного спринту</li><li>Макети авторизації</li><li>Ризики та наступні кроки</li></ol>}<h2>Рішення</h2><div className="callout"><CheckCircle2/><p>Мобільну адаптацію передаємо на review до 5 серпня.</p></div><h2>Наступні кроки</h2><label className="todo"><input type="checkbox"/> Підготувати мобільну адаптацію — Каріна — до 5 серпня</label><label className="todo"><input type="checkbox"/> Перевірити API — Андрій — до 7 серпня</label><Button disabled={stepsConverted} onClick={()=>{if(stepsConverted)return;setTasks(current=>[...current,{title:"Підготувати мобільну адаптацію",project:meetingSpace,status:"Заплановано",due:"05 сер",priority:"Високий",owner:"КБ",collaborators:["Каріна","Андрій"],tags:["зустріч"]},{title:"Перевірити API",project:meetingSpace,status:"Заплановано",due:"07 сер",priority:"Середній",owner:"АС",collaborators:["Андрій"],tags:["api"]}]);setStepsConverted(true);showToast("Створено 2 задачі")}}><ListTodo/> {stepsConverted?"Задачі створено":"Перетворити на задачі"}</Button></div>
        </section>}

        {workspaceMode === "demo" && view === "tasks" && <section className="content">
          <div className="page-head"><div><span className="eyebrow">БАЗА ДАНИХ</span><h1>Задачі команди</h1><p>Вся робота команди в одному місці</p></div><Button onClick={() => setCreateOpen(true)}><Plus /> Нова задача</Button></div>
          <div className="database-tools"><div className="segmented"><button className={taskMode === "board" ? "active" : ""} onClick={() => setTaskMode("board")}><KanbanSquare /> Дошка</button><button className={taskMode === "table" ? "active" : ""} onClick={() => setTaskMode("table")}><Table2 /> Таблиця</button><button className={taskMode === "list" ? "active" : ""} onClick={() => setTaskMode("list")}><List /> Список</button><button className={taskMode === "calendar" ? "active" : ""} onClick={() => setTaskMode("calendar")}><CalendarDays /> Календар</button><button className={taskMode === "timeline" ? "active" : ""} onClick={() => setTaskMode("timeline")}><Activity /> Timeline</button><button className={taskMode === "gallery" ? "active" : ""} onClick={() => setTaskMode("gallery")}><LayoutGrid /> Галерея</button></div><div className="db-actions"><button className={taskFilter==="mine"?"filter-chip active":""} onClick={()=>setTaskFilter(taskFilter==="mine"?"all":"mine")}><Users/> Мої</button>{taskFilter !== "all" && taskFilter !== "mine" && <button className="filter-chip active" onClick={() => setTaskFilter("all")}><Filter /> {taskFilter === "today" ? "Сьогодні" : taskFilter === "urgent" ? "Термінові" : "На перевірці"} <X /></button>}<div className="relative task-filter-control"><button onClick={() => setTaskFilterOpen(current=>!current)}><Filter /> Фільтр</button>{taskFilterOpen&&<div className="task-filter-menu"><button onClick={()=>{setTaskFilter("all");setTaskFilterOpen(false)}}>Всі задачі{taskFilter==="all"&&<Check/>}</button><button onClick={()=>{setTaskFilter("today");setTaskFilterOpen(false)}}>На сьогодні{taskFilter==="today"&&<Check/>}</button><button onClick={()=>{setTaskFilter("urgent");setTaskFilterOpen(false)}}>Високий пріоритет{taskFilter==="urgent"&&<Check/>}</button><button onClick={()=>{setTaskFilter("review");setTaskFilterOpen(false)}}>На перевірці{taskFilter==="review"&&<Check/>}</button></div>}</div><button onClick={() => {setTasks(current=>[...current].sort((a,b)=>a.title.localeCompare(b.title,"uk")));showToast("Відсортовано за назвою")}}><ArrowUpDown /> Сортування</button><button aria-label="Пошук" onClick={() => setSearchOpen(true)}><Search /></button></div></div>
          {taskMode === "board" ? <div className="board dynamic-board">{taskStatuses.map((status, i) => <div className="column" key={status.name}><div className="column-title"><span className={`status-dot tone-${status.color}`} />{status.name}<b>{visibleTasks.filter(t => t.status === status.name).length}</b><button aria-label="Додати задачу" onClick={() => { setCreateTaskStatus(status.name); setCreateOpen(true); }}><Plus /></button><button aria-label="Редагувати колонку" onClick={() => openStatusEditor(status.name)}><Ellipsis /></button></div>{visibleTasks.filter(t => t.status === status.name).map(task => <article className="task-card" key={task.title}><button className="drag-handle" aria-label="Перемістити" onClick={() => setStatusMenuTask(`${task.title}:main`)}><GripVertical /></button>{taskPriorityPicker(task)}<button className="task-title-link" onClick={()=>setActiveTaskTitle(task.title)}>{task.title}</button><p>{task.project}</p>{taskPeopleTags(task)}{taskHashtags(task)}{taskStatusPicker(task)}<div className="task-due-control"><Clock/><span>{task.due}</span><input aria-label={`Змінити термін ${task.title}`} type="date" value={/^\d{4}-/.test(task.due)?task.due:""} onChange={e=>updateTaskDue(task.title,e.target.value)}/></div><div className="task-meta"><span className="avatar mini">{task.owner}</span></div></article>)}</div>)}<button className="add-board-column" onClick={()=>openStatusEditor()}><Plus/><span><strong>Нова колонка</strong><small>Створити новий статус</small></span></button></div> :
          taskMode === "timeline" ? <div className="timeline-panel"><div className="timeline-head"><span>Задача</span>{["30 лип","31 лип","1 сер","2 сер","3 сер","4 сер","5 сер"].map(day=><b key={day}>{day}</b>)}</div>{visibleTasks.map((task,i)=><div className="timeline-row" key={task.title}><div><button className="task-title-link" onClick={()=>setActiveTaskTitle(task.title)}>{task.title}</button><small>{task.owner} · {task.project}</small></div><div className="timeline-track"><span className={`timeline-bar bar-${i}`} /></div></div>)}</div> :
          taskMode === "gallery" ? <div className="task-gallery">{visibleTasks.map((task,i)=><button key={task.title} onClick={()=>setActiveTaskTitle(task.title)}><div className={`task-gallery-cover cover-${i%4}`}><ListTodo/><span>{task.project}</span></div><div><span className={`notion-status tone-${statusColor(task.status)}`}><i/>{task.status}</span><h3>{task.title}</h3>{taskPeopleTags(task)}{taskHashtags(task)}<footer><span className={priorityClass(task.priority)}>{task.priority}</span><small>{task.due}</small></footer></div></button>)}</div> :
          taskMode === "list" ? <div className="task-list-view">{visibleTasks.map(task=><div className="task-list-row" key={task.title}>{taskStatusPicker(task)}<span><button className="task-title-link" onClick={()=>setActiveTaskTitle(task.title)}>{task.title}</button><small>{task.project} · {task.due}</small><div className="task-inline-properties">{taskPeopleTags(task)}{taskHashtags(task)}</div></span>{taskPriorityPicker(task)}<span className="avatar mini">{task.owner}</span></div>)}</div> :
          taskMode === "calendar" ? <div className="task-month"><div className="task-month-head"><div><button aria-label="Попередній місяць" disabled={taskCalendarMonth===0} onClick={()=>setTaskCalendarMonth(current=>Math.max(0,current-1))}><ChevronLeft/></button><h2>{taskCalendarMonths[taskCalendarMonth]}</h2><button aria-label="Наступний місяць" disabled={taskCalendarMonth===taskCalendarMonths.length-1} onClick={()=>setTaskCalendarMonth(current=>Math.min(taskCalendarMonths.length-1,current+1))}><ChevronRight/></button></div><button onClick={()=>setTaskCalendarMonth(1)}>Сьогодні</button></div><div className="task-month-weekdays">{["Пн","Вт","Ср","Чт","Пт","Сб","Нд"].map(day=><b key={day}>{day}</b>)}</div><div className="task-month-grid">{[29,30,...Array.from({length:31},(_,i)=>i+1),1,2].map((day,index)=>{const outside=index<2||index>32;const dayTasks=outside?[]:visibleTasks.filter((task,taskIndex)=>task.due==="Сьогодні"?day===30:((taskIndex*3+2)%28)+1===day);return <div className={`${outside?"outside":""} ${!outside&&day===30&&taskCalendarMonth===1?"today":""}`} key={`${index}-${day}`}><span>{day}</span>{dayTasks.map(task=><button className={`month-task tone-${statusColor(task.status)}`} key={task.title} onClick={()=>setActiveTaskTitle(task.title)}><span className="month-task-title"><i/>{task.title}</span><small><b className={`calendar-priority ${task.priority==="Високий"?"priority-high":task.priority==="Низький"?"priority-low":"priority-medium"}`}>{task.priority}</b>{task.collaborators[0]&&<span>{personById(task.collaborators[0])?.initials || task.collaborators[0]}</span>}{task.tags[0]&&<span>#{task.tags[0]}</span>}</small></button>)}</div>})}</div></div> :
          <div className="table-panel"><div className="table-row table-head"><span>Задача</span><span>Статус</span><span>Пріоритет</span><span>Причетні</span><span>Теги</span><span>Проєкт</span><span>Термін</span></div>{visibleTasks.map(task => <div className="table-row" key={task.title}><button className="task-title-link" onClick={()=>setActiveTaskTitle(task.title)}>{task.title}</button>{taskStatusPicker(task)}{taskPriorityPicker(task)}{taskPeopleTags(task)}{taskHashtags(task)}<span>{task.project}</span><span className={task.due==="Без терміну"?"muted-due":""}>{task.due}</span></div>)}</div>}
        </section>}

        {workspaceMode === "demo" && view === "new-page" && <section className="blank-page">
          {pageCover ? <div className="blank-cover" style={{backgroundImage:`url(${pageCover})`}}><button onClick={()=>setPageCover(null)}>Видалити обкладинку</button></div> : null}
          <article className="blank-editor">
            <div className="page-tools"><button onClick={()=>setIconPickerOpen(true)}><Sparkles /> Змінити іконку</button><label><Image /> Додати обкладинку<input type="file" accept="image/*" onChange={e=>{const file=e.target.files?.[0];if(file)setPageCover(URL.createObjectURL(file))}}/></label><button onClick={()=>setShareModalOpen(true)}><Share2/> Поділитися</button></div>
            <button className="blank-page-icon" aria-label="Змінити іконку сторінки" onClick={()=>setIconPickerOpen(true)}>{pageIcon}</button>
            <input className="blank-title" autoFocus value={pageTitle} onChange={e=>setPageTitle(e.target.value)} placeholder="Без назви"/>
            <div className="page-blocks">{pageBlocks.map((block,i)=><div className={`editor-block block-${block}`} key={`${block}-${i}`}>
              <button className="block-drag" aria-label="Перемістити блок вище" onClick={() => movePageBlockUp(i)}><GripVertical /></button>
              {block === "text" && <p contentEditable suppressContentEditableWarning>Почніть писати текст…</p>}
              {block === "heading" && <h2 contentEditable suppressContentEditableWarning>Заголовок</h2>}
              {block === "bullets" && <ul><li contentEditable suppressContentEditableWarning>Елемент списку</li></ul>}
              {block === "checklist" && <label><input type="checkbox"/> <span contentEditable suppressContentEditableWarning>Нова задача</span></label>}
              {block === "toggle" && <details open><summary><ChevronRight/> <span contentEditable suppressContentEditableWarning>Розгорнутий блок</span></summary><p contentEditable suppressContentEditableWarning>Прихований вміст</p></details>}
              {block === "quote" && <blockquote contentEditable suppressContentEditableWarning>Цитата або важлива думка</blockquote>}
              {block === "callout" && <div className="callout"><Sparkles/><p contentEditable suppressContentEditableWarning>Важлива інформація або примітка</p></div>}
              {block === "divider" && <hr/>}
              {block === "table" && <div className="inline-table"><div><b>Назва</b><b>Статус</b><b>Власник</b></div>{inlineTableRows.map((row,rowIndex)=><div key={`${row}-${rowIndex}`}><span contentEditable suppressContentEditableWarning>{row}</span><select defaultValue="Заплановано"><option>Заплановано</option><option>В роботі</option><option>Готово</option></select><span>КБ</span></div>)}<button onClick={()=>{setInlineTableRows(current=>[...current,`Новий запис ${current.length+1}`]);showToast("Рядок додано")}}>+ Новий рядок</button></div>}
              {block === "board" && <div className="inline-board">{["Заплановано","В роботі","Готово"].map(status=><div key={status}><b>{status}</b>{(inlineBoardCards[status]||[]).map((card,cardIndex)=><button key={`${card}-${cardIndex}`} onClick={()=>showToast(`Відкрито «${card}»`)}>{card}</button>)}<button className="inline-add" onClick={()=>{setInlineBoardCards(current=>({...current,[status]:[...(current[status]||[]),`Нова картка ${(current[status]||[]).length+1}`]}));showToast("Картку додано")}}>+ Додати</button></div>)}</div>}
              {block === "image" && <label className="image-drop"><Image/><strong>Додати зображення</strong><small>Натисніть, щоб обрати файл</small><input type="file" accept="image/*" onChange={()=>showToast("Зображення додано")}/></label>}
              {block === "file" && <label className="file-block"><Paperclip/><span><strong>Завантажити файл</strong><small>PDF, DOCX, XLSX або інший формат</small></span><input type="file" onChange={e=>showToast(e.target.files?.[0]?.name || "Файл додано")}/></label>}
              {block === "link" && <div className="link-block"><Link2/><input value={linkDraft} onChange={event=>setLinkDraft(event.target.value)} placeholder="Вставте посилання…"/><button disabled={!linkDraft.trim()} onClick={()=>showToast(`Посилання збережено: ${linkDraft}`)}>Додати</button></div>}
              {block === "page" && <button className="nested-page" onClick={createBlankPage}><FileText/><span><strong>Без назви</strong><small>Вкладена сторінка</small></span><ArrowRight/></button>}
            </div>)}</div>
            {pageBlocks.length === 0 && <p className="blank-hint">Натисніть нижче або введіть «/», щоб додати перший блок.</p>}
            <button className="add-block blank-add" onClick={()=>setSlashOpen(true)}><Plus /> Додати блок</button>
          </article>
        </section>}

        {workspaceMode === "demo" && view === "document" && <section className="document-wrap">
          <div className="doc-cover"><div className="cover-rail" /><span>UZ / DIGITAL</span></div>
          <article className="document" onMouseUp={captureSelection}>
            <div className="doc-icon"><WandSparkles /></div><div className="doc-actions"><button className={pageFavorite?"active":""} onClick={() => {setPageFavorite(current=>!current);showToast(pageFavorite?"Видалено з обраного":"Додано до обраного")}}><Star fill={pageFavorite?"currentColor":"none"}/> {pageFavorite?"В обраному":"Обране"}</button><button onClick={() => setCommentsPanelOpen(true)}><MessageSquare /> Коментарі <span className="comment-count">{pageComments.filter(comment=>!comment.resolved).length}</span></button><button onClick={() => setShareModalOpen(true)}><Share2 /> Поділитися</button><div className="relative"><button aria-label="Дії сторінки" onClick={() => setPageMenuOpen(current=>!current)}><Ellipsis /></button>{pageMenuOpen&&<div className="page-action-menu"><button onClick={()=>{setPageMenuOpen(false);setPageTitle(`${pageTitle||"UZ Workspace"} — копія`);showToast("Сторінку продубльовано")}}><Copy/> Дублювати</button><button onClick={()=>{setPageMenuOpen(false);setDocsMode("root");go("docs");showToast("Сторінку переміщено до «Мої сторінки»")}}><Folder/> Перемістити</button><button onClick={()=>{setPageMenuOpen(false);setPageTitle("");go("docs");showToast("Сторінку переміщено в кошик")}}><Archive/> У кошик</button></div>}</div></div>
            <h1 contentEditable suppressContentEditableWarning>{pageTitle || "UZ Workspace"}</h1><p className="doc-meta">Оновлено сьогодні о 14:31 · Каріна Барановська</p>
            <div className="properties"><div><span>Статус</span><b className={statusClass("В роботі")}><i />В роботі</b></div><div><span>Відповідальна</span><b><span className="avatar mini">КБ</span> Каріна Б.</b></div><div><span>Термін</span><b>15 серпня 2026</b></div></div>
            <h2>Про проєкт</h2><p contentEditable suppressContentEditableWarning>Створюємо єдиний внутрішній простір Укрзалізниці для проєктів, документів і щоденної командної роботи. Зберігаємо знайому гнучкість Notion, але будуємо власну, виразну та послідовну візуальну мову.</p>
            <div className="callout"><span><Sparkles /></span><p><strong>Головний принцип</strong><br/>Інформація має бути доступною за два кліки, а інтерфейс — залишатися спокійним навіть у складних проєктах.</p></div>
            <h2>Основні сценарії</h2><label className="todo"><input type="checkbox" defaultChecked/> Єдиний огляд проєктів і дедлайнів</label><label className="todo"><input type="checkbox" defaultChecked/> Командні простори з різними рівнями доступу</label><label className="todo"><input type="checkbox"/> Шаблони сторінок для повторюваних процесів</label><label className="todo"><input type="checkbox"/> Автоматичний щотижневий дайджест</label>
            {documentBlocks.map((block,index)=><div className={`document-added-block block-${block}`} key={`${block}-${index}`}>{block==="heading"?<h2 contentEditable suppressContentEditableWarning>Новий заголовок</h2>:block==="checklist"?<label className="todo"><input type="checkbox"/><span contentEditable suppressContentEditableWarning>Новий пункт</span></label>:block==="quote"?<blockquote contentEditable suppressContentEditableWarning>Нова цитата</blockquote>:block==="divider"?<hr/>:block==="callout"?<div className="callout"><Sparkles/><p contentEditable suppressContentEditableWarning>Нова примітка</p></div>:<p contentEditable suppressContentEditableWarning>Новий блок — почніть писати…</p>}</div>)}
            <button className="add-block" onClick={() => setSlashOpen(true)}><Plus /> Додати блок або введіть «/»</button>
          </article>
          <button className="floating-comment-button" aria-label="Залишити коментар" onClick={()=>{setSelectedQuote(null);setCommentsPanelOpen(true)}}><MessageSquare/><span>Коментар</span></button>
          {selectedQuote && <button className="selection-comment-action" style={{left:selectedQuote.x,top:selectedQuote.y}} onMouseDown={e=>e.preventDefault()} onClick={()=>setCommentsPanelOpen(true)}><MessageSquare/> Коментувати</button>}
        </section>}

        {workspaceMode === "demo" && view === "teamspace" && <section className="content teamspace-page">
          <div className="page-head"><div><span className="eyebrow">КОМАНДНИЙ ПРОСТІР</span><h1>Цифрові продукти</h1><p>Сторінки, бази й матеріали, якими команда поділилася у цьому просторі</p></div><Button onClick={createBlankPage}><Plus/> Нова сторінка</Button></div>
          <div className="teamspace-layout"><div><h2>Сторінки</h2><div className="page-tree"><button onClick={()=>openDocument("UZ Workspace")}><FileText/><span><strong>UZ Workspace</strong><small>Спільна сторінка</small></span><ArrowRight/></button><button onClick={()=>go("tasks")}><Table2/><span><strong>Задачі команди</strong><small>База даних</small></span><ArrowRight/></button><button onClick={createBlankPage}><Plus/><span><strong>Додати сторінку</strong><small>Порожня або із шаблону</small></span><ArrowRight/></button></div></div>
            <div><div className="teamspace-section-head"><h2>Учасники</h2><button onClick={()=>go("team")}>Всі учасники</button></div><div className="people-list">{["Каріна Барановська|UI/UX дизайнер|КБ","Олена Михайлюк|Product manager|ОМ","Андрій Стеценко|Frontend developer|АС","Марія Коваль|Business analyst|МК"].map((m,i)=>{const[n,r,a]=m.split("|");return <button key={n} onClick={()=>openMember(n)}><span className={`avatar large av${i}`}>{a}</span><span><strong>{n}</strong><small>{r}</small></span><ArrowRight/></button>})}</div></div></div>
        </section>}

        {workspaceMode === "demo" && view === "member" && <section className="content member-page">
          <button className="back-link" onClick={()=>go("teamspace")}><ArrowRight/> Назад до «Цифрові продукти»</button>
          <div className="member-hero"><span className="avatar large">{selectedMember.split(" ").map(x=>x[0]).join("")}</span><div><span className="eyebrow">УЧАСНИК ПРОСТОРУ</span><h1>{selectedMember}</h1><p>Активність лише у спільному просторі «Цифрові продукти»</p></div></div>
          <div className="member-stats"><article><strong>6</strong><span>активних задач</span></article><article><strong>4</strong><span>створені сторінки</span></article><article><strong>2</strong><span>зустрічі цього тижня</span></article></div>
          <div className="member-content"><div className="section-heading"><div><span className="eyebrow">У ЦЬОМУ ПРОСТОРІ</span><h2>Робота учасника</h2></div><button onClick={()=>go("tasks")}>Відкрити всі задачі</button></div><div className="page-tree"><button onClick={()=>go("tasks")}><Table2/><span><strong>Задачі {selectedMember.split(" ")[0]}</strong><small>6 активних · 2 очікують ревʼю</small></span><ArrowRight/></button><button onClick={()=>go("document")}><FileText/><span><strong>Сторінки, створені в просторі</strong><small>4 сторінки · останнє оновлення сьогодні</small></span><ArrowRight/></button><button onClick={()=>go("files")}><Folder/><span><strong>Файли в «Цифрових продуктах»</strong><small>8 файлів · доступ згідно з правами простору</small></span><ArrowRight/></button></div></div>
        </section>}

        {workspaceMode === "demo" && view === "team" && <section className="content"><div className="page-head"><div><span className="eyebrow">КОМАНДА</span><h1>Цифрові продукти</h1><p>Люди, ролі та поточне навантаження</p></div><button className="primary" onClick={() => setTeamInviteOpen(true)}><UserPlus/> Запросити</button></div><div className="team-grid">{workspacePeople.map((person,i)=><article className="member-card" key={person.id}><span className={`avatar large av${i%4}`}>{person.initials}</span><h3>{person.name}</h3><p>{person.role}</p><span className="workload">{i%3+3} задачі</span><button onClick={() => openMember(person.name)}>Відкрити сторінку →</button></article>)}</div></section>}
        {false && view === "docs" && <section className="content"><div className="page-head"><div><span className="eyebrow">ПРИВАТНІ СТОРІНКИ</span><h1>Мій простір</h1><p>Сторінки й чернетки, які створили ви</p></div><Button onClick={createBlankPage}><FilePlus2 /> Нова сторінка</Button></div><div className="docs-toolbar"><div className="segmented"><button className="active" onClick={() => showToast("Увімкнено сітку")}><LayoutGrid /> Grid</button><button onClick={() => showToast("Увімкнено список")}><List /> List</button></div><button onClick={() => setSearchOpen(true)}><Search /> Пошук</button><button onClick={() => showToast("Фільтри відкрито")}><Filter /> Фільтри</button></div><div className="docs-grid">{["Без назви|Чернетка|Сьогодні","Нотатки зустрічі · 30 липня|Сторінка|Сьогодні","Booking · Робочі матеріали|Сторінка|Учора","Ідеї та нотатки|Особисте|28 липня","Корисні посилання|Сторінка|27 липня","Підсумки тижня|Сторінка|25 липня"].map((item,i)=>{const [name,type,date]=item.split("|");return <button className="doc-card" key={name} onClick={() => go("document")}><div className={`doc-preview preview-${i}`}><FileText /><Ellipsis /></div><div><span className="doc-type">{type}</span><h3>{name}</h3><p>Оновлено: {date}</p></div></button>})}</div></section>}

        {workspaceMode === "demo" && view === "docs" && <section className="content personal-pages">
          <div className="page-head"><div><span className="eyebrow">{docsMode==="shared"?"ДОСТУП ВІД КОЛЕГ":"ОСОБИСТИЙ ПРОСТІР"}</span><h1>{docsMode==="shared"?"Спільні зі мною":docsMode==="all"?"Всі сторінки":"Мої сторінки"}</h1><p>{docsMode==="shared"?"Сторінки, до яких колеги надали вам особистий доступ":docsMode==="all"?"Всі ваші сторінки незалежно від рівня вкладеності":"Кореневі сторінки вашого приватного workspace"}</p></div><Button onClick={createBlankPage}><FilePlus2/> Нова сторінка</Button></div>
          <div className="pages-viewbar"><div className="segmented"><button className={docsMode==="root"?"active":""} onClick={()=>setDocsMode("root")}><LayoutGrid/> Мої сторінки</button><button className={docsMode==="all"?"active":""} onClick={()=>setDocsMode("all")}><List/> Всі сторінки</button><button className={docsMode==="shared"?"active":""} onClick={()=>setDocsMode("shared")}><Share2/> Спільні зі мною</button></div><div className="db-actions"><button onClick={()=>setSearchOpen(true)}><Search/> Пошук</button><div className="relative docs-sort-control"><button onClick={()=>setDocsSortOpen(current=>!current)}><ArrowUpDown/> {docsSort==="updated"?"Оновлені спочатку":docsSort==="name"?"За назвою":"Нещодавно створені"}<ChevronDown/></button>{docsSortOpen&&<div className="docs-sort-menu">{[["updated","Оновлені спочатку"],["name","За назвою"],["created","Нещодавно створені"]].map(([value,label])=><button className={docsSort===value?"active":""} key={value} onClick={()=>{setDocsSort(value as typeof docsSort);setDocsSortOpen(false)}}>{label}{docsSort===value&&<Check/>}</button>)}</div>}</div></div></div>
          {docsMode==="root" && <div className="root-pages-grid">{["Робота|12 вкладених сторінок|Сьогодні|blue","Особисті проєкти|6 вкладених сторінок|Учора|orange","Чернетки|4 вкладені сторінки|28 липня|green"].map(item=>{const[name,count,date,tone]=item.split("|");return <button className={`root-page-card ${tone}`} key={name} onClick={()=>openDocument(name)}><span className="root-page-icon"><Folder/></span><span className="root-page-copy"><strong>{name}</strong><small>{count}</small><em>Оновлено {date.toLowerCase()}</em></span><ArrowRight/></button>})}<button className="root-page-card new-root-page" onClick={createBlankPage}><span className="root-page-icon"><Plus/></span><span className="root-page-copy"><strong>Нова коренева сторінка</strong><small>Почніть із чистої сторінки</small></span></button></div>}
          {docsMode==="all" && <div className="all-pages-list">{["Робота|Коренева сторінка|Сьогодні","Робота / Паролі|Вкладена сторінка|Сьогодні","Робота / Корисні посилання|Вкладена сторінка|Учора","Особисті проєкти / Портфоліо|Вкладена сторінка|28 липня","Чернетки / Чернетка ТЗ|Вкладена сторінка|27 липня"].map(item=>{const[name,level,date]=item.split("|");return <button key={name} onClick={()=>openDocument(name)}><FileText/><span><strong>{name}</strong><small>{level}</small></span><time>{date}</time><ArrowRight/></button>})}</div>}
          {docsMode==="shared" && <div className="shared-pages-grid">{["Чернетка ТЗ|Олена Михайлюк|Перегляд|ОМ|blue","План дослідження|Андрій Стеценко|Редагування|АС|orange","Нотатки до зустрічі|Марія Коваль|Коментування|МК|green"].map(item=>{const[name,owner,access,avatar,tone]=item.split("|");return <button className={`shared-page-card ${tone}`} key={name} onClick={()=>openDocument(name)}><div className="shared-card-top"><span className="shared-doc-icon"><FileText/></span><span className="access-badge">{access}</span></div><strong>{name}</strong><p>Сторінкою поділилася команда</p><div className="shared-owner"><span className="avatar mini">{avatar}</span><span><b>{owner}</b><small>Оновлено сьогодні</small></span><ArrowRight/></div></button>})}</div>}
        </section>}

        {workspaceMode === "demo" && view === "comments" && <section className="content"><div className="page-head"><div><span className="eyebrow">ОБГОВОРЕННЯ</span><h1>Коментарі</h1><p>Згадки, відповіді та відкриті обговорення на сторінках</p></div><button className="secondary-action" onClick={() => setPageComments(current=>current.map(comment=>({...comment,resolved:true})))}><Check /> Позначити вирішеними</button></div><div className="comments-layout"><aside className="comment-filters"><button className={commentFilter==="open"?"active":""} onClick={()=>setCommentFilter("open")}>Відкриті <span>{pageComments.filter(comment=>!comment.resolved).length}</span></button><button className={commentFilter==="mentions"?"active":""} onClick={()=>setCommentFilter("mentions")}>Згадки <span>{pageComments.filter(comment=>comment.text.includes("@")||comment.author!=="Каріна Барановська").length}</span></button><button className={commentFilter==="resolved"?"active":""} onClick={()=>setCommentFilter("resolved")}>Вирішені <span>{pageComments.filter(comment=>comment.resolved).length}</span></button></aside><div><div className="comment-page-composer"><span className="avatar mini avatar-me">КБ</span><input value={newComment} onChange={e=>setNewComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addComment()} placeholder="Залишити коментар…"/><Button onClick={addComment}>Надіслати</Button></div><div className="comment-list">{filteredComments.map((comment,i)=><article className={`comment-card ${comment.resolved?"resolved":""}`} key={comment.id}><span className={`avatar large av${i%4}`}>{comment.initials}</span><div><div className="comment-top"><strong>{comment.author}</strong><small>{comment.time}</small></div><p>{comment.text}</p><span className="comment-page"><FileText /> UZ Workspace</span><div className="comment-actions"><button onClick={()=>{setCommentsPanelOpen(true);setNewComment(`@${comment.author.split(" ")[0]} `)}}>Відповісти</button><button onClick={()=>resolveComment(comment.id)}><Check /> {comment.resolved?"Повернути":"Вирішити"}</button></div></div></article>)}{!filteredComments.length&&<div className="empty-panel"><CheckCircle2/><strong>Тут усе чисто</strong><p>Коментарі з цього фільтра з’являться тут.</p></div>}</div></div></div></section>}

        {workspaceMode === "demo" && view === "projects" && <section className="content resource-page">
          <div className="page-head"><div><span className="eyebrow">РОБОЧІ НАПРЯМИ</span><h1>Проєкти</h1><p>Прогрес, команда та остання активність у всіх доступних проєктах</p></div><Button onClick={()=>{setTemplateOpen(true)}}><Plus/> Новий проєкт</Button></div>
          <div className="resource-toolbar"><div className="segmented">{[["all","Всі"],["active","Активні"],["review","Потребують уваги"]].map(([value,label])=><button className={projectFilter===value?"active":""} key={value} onClick={()=>setProjectFilter(value as typeof projectFilter)}>{label}</button>)}</div><button onClick={()=>setSearchOpen(true)}><Search/> Знайти проєкт</button></div>
          <div className="project-browser-grid">{projects.filter(project=>projectFilter==="all"||projectFilter==="active"&&project.progress<85||projectFilter==="review"&&project.progress<60).map(project=><article className={`project-browser-card ${project.color}`} key={project.name}><header><span><Folder/></span><span className={project.progress<60?"project-health warning":"project-health"}>{project.progress<60?"Потребує уваги":"За планом"}</span></header><h2>{project.name}</h2><p>{project.team}</p><div className="project-progress"><span style={{width:`${project.progress}%`}}/><b>{project.progress}%</b></div><small>{project.meta}</small><footer><span className="avatar-stack"><i>КБ</i><i>ОМ</i><i>АС</i></span><button onClick={()=>openDocument(project.name)}>Відкрити <ArrowRight/></button></footer></article>)}</div>
        </section>}

        {workspaceMode === "demo" && view === "files" && <section className="content resource-page">
          <div className="page-head"><div><span className="eyebrow">МАТЕРІАЛИ</span><h1>Файли</h1><p>Документи, макети й таблиці з доступних сторінок та просторів</p></div><Button onClick={()=>setUploadModalOpen(true)}><Upload/> Завантажити</Button></div>
          <div className="resource-toolbar"><div className="resource-search"><Search/><input value={fileSearch} onChange={event=>setFileSearch(event.target.value)} placeholder="Знайти файл…"/></div><div className="segmented">{[["all","Всі"],["docs","Документи"],["design","Дизайн"],["tables","Таблиці"]].map(([value,label])=><button className={fileType===value?"active":""} key={value} onClick={()=>setFileType(value as typeof fileType)}>{label}</button>)}</div></div>
          <div className="file-grid">{[
            ["Бриф Workspace.pdf","PDF · 4.8 MB","docs","red"],["Структура даних.xlsx","XLSX · 1.2 MB","tables","green"],["Макети головної.fig","Figma · 18 MB","design","violet"],["Протокол зустрічі.docx","DOCX · 620 KB","docs","blue"],...uploadedFiles.filter(name=>!["Бриф Workspace.pdf","Структура даних.xlsx","Макети головної.fig"].includes(name)).map(name=>[name,"Новий файл","docs","orange"])
          ].filter(([name,,type])=>(fileType==="all"||type===fileType)&&name.toLowerCase().includes(fileSearch.toLowerCase())).map(([name,meta,,tone])=><article className={`file-card ${tone}`} key={name}><span className="file-preview"><FileText/></span><div><strong>{name}</strong><small>{meta}</small><p>Цифрові продукти · оновлено сьогодні</p></div><button aria-label={`Дії для ${name}`} onClick={()=>openDocument(name)}><ArrowRight/></button></article>)}</div>
        </section>}

        {workspaceMode === "demo" && view === "recent" && <section className="content resource-page">
          <div className="page-head"><div><span className="eyebrow">ІСТОРІЯ</span><h1>Останні</h1><p>Сторінки, задачі та профілі, які ви нещодавно відкривали</p></div></div>
          <div className="resource-toolbar"><div className="segmented">{[["all","Все"],["pages","Сторінки"],["tasks","Задачі"],["people","Люди"]].map(([value,label])=><button className={recentFilter===value?"active":""} key={value} onClick={()=>setRecentFilter(value as typeof recentFilter)}>{label}</button>)}</div><button onClick={()=>setSearchOpen(true)}><Search/> Пошук</button></div>
          <div className="recent-list">{[
            ["pages","UZ Workspace","Сторінка · 5 хв тому",FileText,"document"],["tasks","Головна сторінка простору","Задача · 24 хв тому",ListTodo,"tasks"],["people","Олена Михайлюк","Учасниця · 1 год тому",Users,"member"],["pages","План дослідження","Спільна сторінка · учора",Share2,"document"]
          ].filter(([type])=>recentFilter==="all"||type===recentFilter).map(([type,title,meta,RecentIcon,target])=><button key={String(title)} onClick={()=>type==="people"?openMember(String(title)):type==="pages"?openDocument(String(title)):go(target as View)}><span><RecentIcon/></span><div><strong>{String(title)}</strong><small>{String(meta)}</small></div><ArrowRight/></button>)}</div>
        </section>}

        {workspaceMode === "demo" && view === "trash" && <section className="content resource-page">
          <div className="page-head"><div><span className="eyebrow">КОШИК</span><h1>Видалені сторінки</h1><p>Елементи зберігаються 30 днів, після чого видаляються остаточно</p></div></div>
          <div className="trash-list">{trashedItems.map((item,index)=><article key={item}><span><Archive/></span><div><strong>{item}</strong><small>Видалено {index+1} дн. тому · Каріна Барановська</small></div><button onClick={()=>{setTrashedItems(current=>current.filter(name=>name!==item));showToast("Сторінку відновлено")}}><ArrowUpDown/> Відновити</button><button className="danger-action" onClick={()=>{setTrashedItems(current=>current.filter(name=>name!==item));showToast("Сторінку видалено назавжди")}}><X/> Видалити</button></article>)}{!trashedItems.length&&<div className="empty-panel"><Archive/><strong>Кошик порожній</strong><p>Видалені сторінки з’являться тут.</p></div>}</div>
        </section>}

        {workspaceMode === "demo" && view === "release" && <section className="content release-page resource-page">
          <button className="back-link" onClick={()=>go("calendar")}><ArrowRight/> Назад до календаря</button>
          <div className="release-hero"><span><Rocket/></span><div><span className="eyebrow">РЕЛІЗ · МТКД</span><h1>Мобільний квиток 2.4</h1><p>2 серпня 2026 · відповідальна команда «Мобільні застосунки»</p></div><span className="status-pill status-review">Готується</span></div>
          <div className="release-grid"><article><h2>Готовність</h2><strong className="release-number">86%</strong><div className="project-progress"><span style={{width:"86%"}}/></div><p>Критичні сценарії перевірено, залишилось фінальне погодження.</p></article><article><h2>Чекліст релізу</h2>{["QA пройдено","Release notes готові","App Store metadata","Погодження бізнесу"].map((item,index)=><label key={item}><input type="checkbox" defaultChecked={index<2}/>{item}</label>)}</article><article><h2>Матеріали</h2><button onClick={()=>openDocument("Release notes 2.4")}><FileText/> Release notes 2.4 <ArrowRight/></button><button onClick={()=>go("files")}><Paperclip/> Збірки й макети <ArrowRight/></button></article></div>
        </section>}

        {workspaceMode === "demo" && view === "access-requests" && <section className="content resource-page">
          <div className="page-head"><div><span className="eyebrow">ДОСТУПИ</span><h1>Запити на доступ</h1><p>Переглядайте, кому і до яких матеріалів потрібен доступ</p></div></div>
          <div className="access-request-list">{accessRequests.map(request=><article className={request.status!=="pending"?"resolved":""} key={request.id}><span className="avatar large">{request.initials}</span><div><strong>{request.name}</strong><p>Просить доступ до «{request.resource}»</p><small>Рівень: {request.access} · 15 хв тому</small></div>{request.status==="pending"?<footer><button onClick={()=>setAccessRequests(current=>current.map(item=>item.id===request.id?{...item,status:"denied"}:item))}>Відхилити</button><Button onClick={()=>setAccessRequests(current=>current.map(item=>item.id===request.id?{...item,status:"approved"}:item))}>Надати доступ</Button></footer>:<span className={`request-result ${request.status}`}>{request.status==="approved"?"Доступ надано":"Відхилено"}</span>}</article>)}</div>
        </section>}

        {workspaceMode === "demo" && (view === "profile" || view === "settings") && <section className="content settings-page"><div className="page-head"><div><span className="eyebrow">ОСОБИСТИЙ КАБІНЕТ</span><h1>{settingsPane==="profile"?"Профіль":settingsPane==="workspace"?"Налаштування workspace":"Сповіщення"}</h1><p>Керуйте персональними даними та робочим середовищем</p></div></div><div className="settings-layout"><aside><button className={settingsPane==="profile"?"active":""} onClick={()=>{setSettingsPane("profile");go("profile")}}><Users /> Профіль</button><button className={settingsPane==="workspace"?"active":""} onClick={()=>{setSettingsPane("workspace");go("settings")}}><Settings /> Workspace</button><button className={settingsPane==="notifications"?"active":""} onClick={()=>setSettingsPane("notifications")}><Bell /> Сповіщення</button></aside><div className="profile-panel">{settingsPane==="profile"?<><div className="profile-hero"><div className="profile-photo">{profileImage?<img src={profileImage} alt="Фото профілю"/>:<span>КБ</span>}<label aria-label="Змінити фото"><Camera/><input type="file" accept="image/*" onChange={event=>{const file=event.target.files?.[0];if(file){setProfileImage(URL.createObjectURL(file));showToast("Фото оновлено")}}}/></label></div><div><h2>Каріна Барановська</h2><p>UI/UX дизайнер · Команда ЦІТ</p></div><label className="secondary-action upload-control"><Upload /> Змінити фото<input type="file" accept="image/*" onChange={event=>{const file=event.target.files?.[0];if(file){setProfileImage(URL.createObjectURL(file));showToast("Фото оновлено")}}}/></label></div><div className="form-grid"><label>Ім’я та прізвище<input defaultValue="Каріна Барановська"/></label><label>Посада<input defaultValue="UI/UX дизайнер"/></label><label>Email<input defaultValue="karina@uz.gov.ua"/></label><label>Команда<select defaultValue="Цифрові продукти"><option>Цифрові продукти</option><option>Пасажирські сервіси</option></select></label></div><Button onClick={()=>showToast("Зміни збережено")}>Зберегти зміни</Button></>:settingsPane==="workspace"?<><div className="settings-section-head"><Settings/><div><h2>УЗ · Workspace</h2><p>Основні параметри робочого простору</p></div></div><div className="form-grid"><label>Назва workspace<input defaultValue="УЗ · Workspace"/></label><label>Тип<select defaultValue="team"><option value="team">Командний</option><option value="personal">Особистий</option></select></label><label>Доступ<select defaultValue="invite"><option value="invite">Лише за запрошенням</option><option value="uz">Всі працівники УЗ</option></select></label><label>Мова<select defaultValue="uk"><option value="uk">Українська</option><option value="en">English</option></select></label></div><Button onClick={()=>showToast("Налаштування workspace збережено")}>Зберегти налаштування</Button></>:<><div className="settings-section-head"><Bell/><div><h2>Сповіщення</h2><p>Оберіть, про що повідомляти вас</p></div></div><div className="notification-settings"><label><span><strong>Згадки та відповіді</strong><small>Коли вас згадують у сторінці або коментарі</small></span><input type="checkbox" defaultChecked/></label><label><span><strong>Зміни у задачах</strong><small>Статуси, терміни та нові виконавці</small></span><input type="checkbox" defaultChecked/></label><label><span><strong>Запрошення до просторів</strong><small>Нові workspace і спільні сторінки</small></span><input type="checkbox" defaultChecked/></label><label><span><strong>Щотижневий дайджест</strong><small>Підсумок роботи щопонеділка</small></span><input type="checkbox"/></label></div><Button onClick={()=>showToast("Налаштування сповіщень збережено")}>Зберегти</Button></>}</div></div></section>}
      </main>

      {searchOpen && <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setSearchOpen(false)}><div className="command"><div className="command-input"><Search /><input autoFocus placeholder="Знайти сторінку, проєкт або людину…" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Escape" && setSearchOpen(false)}/><kbd>ESC</kbd></div><p>Швидкий перехід</p>{results.map(result => <button key={`${result.title}-${result.sub}`} onClick={() => go(result.view)}><span className="result-icon">{result.view === "tasks" ? <CheckCircle2 /> : result.view === "team" ? <Users /> : <FileText />}</span><span><strong>{result.title}</strong><small>{result.sub}</small></span><kbd>↵</kbd></button>)}</div></div>}
      {createOpen && <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setCreateOpen(false)}><div className="modal task-create-modal"><div className="modal-head"><div><span className="modal-icon"><Check /></span><h2>Нова задача</h2></div><button aria-label="Закрити" onClick={() => setCreateOpen(false)}><X /></button></div><label>Назва задачі<input autoFocus value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="Наприклад, підготувати макети для review"/></label><div className="modal-options"><label>Статус<select value={createTaskStatus} onChange={e=>setCreateTaskStatus(e.target.value)}>{taskStatuses.map(status=><option key={status.name}>{status.name}</option>)}</select></label><label>Проєкт<select><option>UZ Workspace</option><option>Booking Web</option></select></label><label>Термін <small className="optional-label">необов’язково</small><input type="date" value={createTaskDue} onChange={e=>setCreateTaskDue(e.target.value)}/></label><label>Пріоритет<select value={createTaskPriority} onChange={e=>setCreateTaskPriority(e.target.value)}><option>Низький</option><option>Середній</option><option>Високий</option></select></label></div><div className="property-section"><div className="property-heading"><strong>Причетні</strong><small>Виберіть учасників workspace або запросіть за поштою</small></div>{peoplePicker(createTaskPeople,id=>setCreateTaskPeople(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id]))}</div><div className="property-section"><div className="property-heading"><strong>Теги</strong><small>Окремі тематичні позначки, не люди</small></div><div className="tag-editor"><div>{createTaskTags.map(tag=><button type="button" key={tag} onClick={()=>setCreateTaskTags(current=>current.filter(item=>item!==tag))}>#{tag}<X/></button>)}</div><label><input value={tagDraft} onChange={event=>setTagDraft(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();const tag=tagDraft.trim().replace(/^#+/,"").replace(/\s+/g,"-").toLowerCase();if(tag&&!createTaskTags.includes(tag))setCreateTaskTags(current=>[...current,tag]);setTagDraft("")}}} placeholder="Наприклад, дизайн"/><button type="button" onClick={()=>{const tag=tagDraft.trim().replace(/^#+/,"").replace(/\s+/g,"-").toLowerCase();if(tag&&!createTaskTags.includes(tag))setCreateTaskTags(current=>[...current,tag]);setTagDraft("")}}><Plus/> Додати</button></label></div></div><div className="modal-footer"><button onClick={() => setCreateOpen(false)}>Скасувати</button><button className="primary" onClick={addTask}>Створити задачу</button></div></div></div>}
      {statusEditorOpen && <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setStatusEditorOpen(false)}><div className="modal status-editor-modal"><div className="modal-head"><div><span className={`modal-icon status-preview tone-${statusDraftColor}`}><i/></span><h2>{editingStatusName?"Редагувати статус":"Новий статус"}</h2></div><button aria-label="Закрити" onClick={()=>setStatusEditorOpen(false)}><X/></button></div><label>Назва статусу<input autoFocus value={statusDraftName} onChange={e=>setStatusDraftName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveStatus()} placeholder="Наприклад, Заблоковано"/></label><label className="color-picker-label">Колір</label><div className="status-color-grid">{[["gray","Сірий"],["blue","Синій"],["orange","Помаранчевий"],["green","Зелений"],["red","Червоний"],["violet","Фіолетовий"]].map(([color,label])=><button className={statusDraftColor===color?"active":""} key={color} onClick={()=>setStatusDraftColor(color)}><span className={`status-color tone-${color}`}><i/></span>{label}{statusDraftColor===color&&<Check/>}</button>)}</div><div className="modal-footer"><button onClick={()=>setStatusEditorOpen(false)}>Скасувати</button><Button onClick={saveStatus}>{editingStatusName?"Зберегти":"Створити статус"}</Button></div></div></div>}
      {activeTask && <div className="task-peek-scrim" onMouseDown={e=>e.target===e.currentTarget&&setActiveTaskTitle(null)}><aside className="task-peek"><header><span><ListTodo/> Загальні задачі</span><div><button onClick={()=>duplicateTask(activeTask.title)}><Copy/> Дублювати</button><button aria-label="Закрити" onClick={()=>setActiveTaskTitle(null)}><X/></button></div></header><div className="task-peek-body"><span className="eyebrow">ЗАДАЧА</span><input className="task-peek-title" value={activeTask.title} onChange={e=>{const next=e.target.value;setTasks(current=>current.map(task=>task.title===activeTask.title?{...task,title:next}:task));setActiveTaskTitle(next)}}/><div className="task-properties-grid"><label><span>Статус</span>{taskStatusPicker(activeTask,"peek")}</label><label><span>Пріоритет</span>{taskPriorityPicker(activeTask)}</label><label><span>Термін</span><input type="date" value={/^\d{4}-/.test(activeTask.due)?activeTask.due:""} onChange={e=>updateTaskDue(activeTask.title,e.target.value)}/><small>{activeTask.due}</small></label><label><span>Проєкт</span><button onClick={()=>openDocument(activeTask.project)}><Folder/> {activeTask.project}</button></label></div><section className="task-assignees"><div className="property-heading"><strong>Причетні</strong><small>Люди з цього workspace</small></div>{peoplePicker(activeTask.collaborators,id=>toggleTaskPerson(activeTask.title,id))}</section><section className="task-tags-editor"><div className="property-heading"><strong>Теги</strong><small>Для тем, напрямів та швидкої фільтрації</small></div><div className="tag-editor"><div>{activeTask.tags.map(tag=><button type="button" key={tag} onClick={()=>removeTaskTag(activeTask.title,tag)}>#{tag}<X/></button>)}</div><label><input value={tagDraft} onChange={event=>setTagDraft(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();addTaskTag(activeTask.title,tagDraft)}}} placeholder="Додати тег"/><button type="button" onClick={()=>addTaskTag(activeTask.title,tagDraft)}><Plus/> Додати</button></label></div></section><section className="task-description"><h3>Опис</h3><textarea value={taskDescription} onChange={e=>setTaskDescription(e.target.value)}/><button onClick={()=>setSlashOpen(true)}><Plus/> Додати блок або введіть «/»</button></section><section className="task-checklist"><h3>Підзадачі</h3>{subtasks.map(item=><label key={item}><input type="checkbox"/> {item}</label>)}{subtaskComposerOpen&&<div className="subtask-composer"><input autoFocus value={subtaskDraft} onChange={event=>setSubtaskDraft(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"&&subtaskDraft.trim()){setSubtasks(current=>[...current,subtaskDraft.trim()]);setSubtaskDraft("");setSubtaskComposerOpen(false)}}} placeholder="Назва підзадачі"/><button onClick={()=>{if(!subtaskDraft.trim())return;setSubtasks(current=>[...current,subtaskDraft.trim()]);setSubtaskDraft("");setSubtaskComposerOpen(false)}}><Check/></button><button onClick={()=>{setSubtaskDraft("");setSubtaskComposerOpen(false)}}><X/></button></div>}<button onClick={()=>setSubtaskComposerOpen(true)}><Plus/> Нова підзадача</button></section></div><footer><button className="danger-action" onClick={()=>deleteTask(activeTask.title)}><Archive/> У кошик</button><Button onClick={()=>{setActiveTaskTitle(null);setPeopleQuery("");setTagDraft("");showToast("Зміни збережено")}}>Готово</Button></footer></aside></div>}
      {meetingModalOpen && <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setMeetingModalOpen(false)}><div className="modal meeting-modal"><div className="modal-head"><div><span className="modal-icon"><CalendarDays/></span><h2>Нова зустріч</h2></div><button aria-label="Закрити" onClick={()=>setMeetingModalOpen(false)}><X/></button></div><label>Назва зустрічі<input autoFocus value={meetingTitle} onChange={event=>setMeetingTitle(event.target.value)} placeholder="Наприклад, Product Sync"/></label><div className="modal-options"><label>Дата<input type="date" value={meetingDate} onChange={event=>setMeetingDate(event.target.value)}/></label><label>Час<input type="time" value={meetingTime} onChange={event=>setMeetingTime(event.target.value)}/></label><label>Завершення<input type="time" value={meetingEnd} onChange={event=>setMeetingEnd(event.target.value)}/></label><label>Часовий пояс<select><option>Europe/Kyiv</option><option>Europe/Rome</option></select></label><label>Простір<select value={meetingSpace} onChange={event=>setMeetingSpace(event.target.value)}><option>Booking</option><option>МТКД</option><option>Цифрові продукти</option></select></label><label>Формат<select value={meetingFormat} onChange={event=>setMeetingFormat(event.target.value)}><option>Google Meet</option><option>Microsoft Teams</option><option>Zoom</option><option>Офлайн</option></select></label></div><div className="property-section"><div className="property-heading"><strong>Учасники</strong><small>Люди з workspace або запрошення за поштою</small></div>{peoplePicker(meetingPeople,id=>setMeetingPeople(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id]))}</div><div className="availability"><CheckCircle2/><span><strong>Більшість учасників доступні</strong><small>Конфліктів у вибраний час не знайдено.</small></span></div><label>Посилання<input placeholder="https://meet.google.com/…"/></label><label>Опис<textarea value={meetingDescription} onChange={event=>setMeetingDescription(event.target.value)} placeholder="Мета та короткий порядок денний"/></label><div className="modal-footer"><button onClick={()=>setMeetingModalOpen(false)}>Скасувати</button><Button disabled={!meetingTitle.trim()} onClick={()=>{setMeetingModalOpen(false);setPeopleQuery("");setStepsConverted(false);go("meeting");showToast("Зустріч створено й додано до календаря")}}>Створити зустріч</Button></div></div></div>}
      {templateOpen && <div className="overlay" onMouseDown={(e)=>e.target===e.currentTarget&&setTemplateOpen(false)}><div className="template-modal"><div className="modal-head"><div><span className="modal-icon"><LayoutGrid /></span><div><h2>Шаблони UZ Workspace</h2><p>Структури, які можна змінити після створення</p></div></div><button aria-label="Закрити" onClick={()=>setTemplateOpen(false)}><X /></button></div><div className="template-grid">{[
        ["Командний простір","Дашборд, проєкти, задачі та зустрічі",House,"home"],
        ["Проєкт","Опис, команда, прогрес, задачі та файли",Gauge,"document"],
        ["База задач","Table, Board, List і Calendar з одних даних",Table2,"tasks"],
        ["Документація","ТЗ, API, дизайн та інструкції",FileText,"docs"],
        ["Нотатки зустрічі","Agenda, рішення та наступні кроки",BookOpenCheck,"document"],
        ["Особистий простір","Мої задачі, чернетки та збережене",Users,"docs"],
      ].map(([name,desc,TemplateIcon,target])=><button key={String(name)} onClick={()=>{setTemplateOpen(false);setWorkspaceMode("demo");go(target as View);showToast(`Шаблон «${name}» застосовано`)}}><span>{typeof TemplateIcon !== "string" && <TemplateIcon />}</span><strong>{String(name)}</strong><small>{String(desc)}</small><ArrowRight /></button>)}</div></div></div>}
      {teamInviteOpen&&<div className="overlay" onMouseDown={event=>event.target===event.currentTarget&&setTeamInviteOpen(false)}><div className="modal team-invite-modal"><div className="modal-head"><div><span className="modal-icon"><UserPlus/></span><div><h2>Додати учасників</h2><p>Команда «Цифрові продукти»</p></div></div><button aria-label="Закрити" onClick={()=>setTeamInviteOpen(false)}><X/></button></div>{peoplePicker(teamInvitePeople,id=>setTeamInvitePeople(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id]))}<div className="modal-footer"><button onClick={()=>setTeamInviteOpen(false)}>Скасувати</button><Button disabled={!teamInvitePeople.length} onClick={()=>{setTeamInviteOpen(false);setPeopleQuery("");showToast(`Додано учасників: ${teamInvitePeople.length}`)}}>Додати до команди</Button></div></div></div>}
      {spaceModalOpen && <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setSpaceModalOpen(false)}><div className="modal access-modal"><div className="modal-head"><div><span className="modal-icon"><Users/></span><h2>Новий спільний простір</h2></div><button onClick={()=>setSpaceModalOpen(false)}><X/></button></div><label>Назва простору<input autoFocus placeholder="Наприклад, Новий проєкт"/></label><label className="access-label">Запросити учасників</label><div className="invite-list">{["Олена Михайлюк","Андрій Стеценко","Марія Коваль"].map((name,i)=><label key={name}><input type="checkbox"/><span className={`avatar mini av${i}`}>{name.split(" ").map(x=>x[0]).join("")}</span><strong>{name}</strong><select defaultValue="edit"><option value="view">Перегляд</option><option value="comment">Коментування</option><option value="edit">Редагування</option><option value="full">Повний доступ</option></select></label>)}</div><div className="modal-footer"><button onClick={()=>setSpaceModalOpen(false)}>Скасувати</button><Button onClick={()=>{setSpaceModalOpen(false);go("teamspace");showToast("Спільний простір створено")}}>Створити простір</Button></div></div></div>}
      {workspaceModalOpen && <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setWorkspaceModalOpen(false)}><div className="modal workspace-create-modal"><div className="modal-head"><div><span className="modal-icon"><Plus/></span><div><h2>Новий workspace</h2><p>Окреме середовище зі своїми сторінками та учасниками</p></div></div><button aria-label="Закрити" onClick={()=>setWorkspaceModalOpen(false)}><X/></button></div><label>Назва workspace<input autoFocus value={newWorkspaceName} onChange={event=>setNewWorkspaceName(event.target.value)} placeholder="Наприклад, Дизайн-команда"/></label><div className="modal-options"><label>Тип<select defaultValue="team"><option value="team">Командний</option><option value="personal">Особистий</option></select></label><label>Хто може приєднатися<select defaultValue="invite"><option value="invite">Лише за запрошенням</option><option value="uz">Працівники УЗ</option></select></label></div><div className="workspace-choice-note"><Users/><span><strong>Учасників можна додати після створення</strong><small>Для кожного налаштовується перегляд, коментування або редагування.</small></span></div><div className="modal-footer"><button onClick={()=>setWorkspaceModalOpen(false)}>Скасувати</button><Button disabled={!newWorkspaceName.trim()} onClick={()=>{const name=newWorkspaceName.trim();const id=`workspace-${Date.now()}`;const initials=name.split(/[\s-]+/).map(part=>part[0]).join("").slice(0,2).toUpperCase();setWorkspaces(current=>[...current,{id,name,title:`${name} · Workspace`,description:"Командний workspace",initials}]);setWorkspaceScope(id);setNewWorkspaceName("");setWorkspaceModalOpen(false);showToast(`Workspace «${name}» створено`);go("home")}}>Створити workspace</Button></div></div></div>}
      {shareModalOpen && <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setShareModalOpen(false)}><div className="modal access-modal"><div className="modal-head"><div><span className="modal-icon"><Share2/></span><div><h2>Доступ до сторінки</h2><p>Запросіть колег або налаштуйте їхні права</p></div></div><button aria-label="Закрити" onClick={()=>setShareModalOpen(false)}><X/></button></div><div className="share-picker"><div className="people-search"><Search/><input autoFocus value={shareQuery} onChange={event=>setShareQuery(event.target.value)} placeholder="Ім’я або корпоративна пошта"/></div><div className="share-results">{workspacePeople.filter(person=>`${person.name} ${person.email}`.toLowerCase().includes(shareQuery.toLowerCase())).map(person=><button className={pageAccessPeople.includes(person.id)?"active":""} key={person.id} onClick={()=>setPageAccessPeople(current=>current.includes(person.id)?current.filter(id=>id!==person.id):[...current,person.id])}><span className="avatar mini">{person.initials}</span><span><strong>{person.name}</strong><small>{person.email}</small></span>{pageAccessPeople.includes(person.id)?<Check/>:<Plus/>}</button>)}</div></div><div className="access-list">{pageAccessPeople.map(id=>{const person=personById(id);return person?<div className="access-row" key={id}><span className="avatar mini">{person.initials}</span><span><strong>{person.name}</strong><small>{person.email}</small></span><select defaultValue="view"><option value="view">Може переглядати</option><option value="comment">Може коментувати</option><option value="edit">Може редагувати</option><option value="full">Повний доступ</option></select></div>:null})}</div><div className="share-link"><Link2/><span><strong>Посилання на сторінку</strong><small>Доступ мають лише запрошені користувачі</small></span><button onClick={()=>{navigator.clipboard?.writeText("https://workspace.uz.gov.ua/page/demo");showToast("Посилання скопійовано")}}><Copy/> Копіювати</button></div></div></div>}
      {meetingJoinOpen&&<div className="overlay" onMouseDown={event=>event.target===event.currentTarget&&setMeetingJoinOpen(false)}><div className="modal compact-modal"><div className="modal-head"><div><span className="modal-icon"><Video/></span><div><h2>Приєднатися до зустрічі</h2><p>{meetingFormat} · {meetingTime}–{meetingEnd}</p></div></div><button aria-label="Закрити" onClick={()=>setMeetingJoinOpen(false)}><X/></button></div><div className="join-options"><button onClick={()=>{setMeetingJoinOpen(false);showToast(`${meetingFormat} відкрито у новій вкладці`)}}><span><Video/></span><div><strong>Відкрити {meetingFormat}</strong><small>Приєднатися в браузері</small></div><ArrowRight/></button><button onClick={()=>{navigator.clipboard?.writeText("https://meet.google.com/uz-workspace");showToast("Посилання на зустріч скопійовано")}}><span><Copy/></span><div><strong>Копіювати посилання</strong><small>Надіслати його іншому учаснику</small></div><ArrowRight/></button></div></div></div>}
      {iconPickerOpen&&<div className="overlay" onMouseDown={event=>event.target===event.currentTarget&&setIconPickerOpen(false)}><div className="modal icon-picker-modal"><div className="modal-head"><div><span className="modal-icon"><Sparkles/></span><h2>Іконка сторінки</h2></div><button aria-label="Закрити" onClick={()=>setIconPickerOpen(false)}><X/></button></div><div className="emoji-grid">{["✨","🚆","📄","📌","📊","✅","🧭","💡","🗂️","🎯","🔗","🛠️"].map(emoji=><button className={pageIcon===emoji?"active":""} key={emoji} onClick={()=>{setPageIcon(emoji);setIconPickerOpen(false)}}>{emoji}</button>)}</div></div></div>}
      {uploadModalOpen&&<div className="overlay" onMouseDown={event=>event.target===event.currentTarget&&setUploadModalOpen(false)}><div className="modal upload-modal"><div className="modal-head"><div><span className="modal-icon"><Upload/></span><div><h2>Завантажити файли</h2><p>Файли з’являться в розділі «Файли»</p></div></div><button aria-label="Закрити" onClick={()=>setUploadModalOpen(false)}><X/></button></div><label className="upload-dropzone"><Upload/><strong>Оберіть один або кілька файлів</strong><small>PDF, DOCX, XLSX, PNG, Figma та інші формати</small><input type="file" multiple onChange={event=>{const names=Array.from(event.target.files||[]).map(file=>file.name);if(names.length){setUploadedFiles(current=>[...new Set([...current,...names])]);showToast(`Додано файлів: ${names.length}`)}}}/></label><div className="uploaded-file-list">{uploadedFiles.slice(-4).map(name=><span key={name}><FileText/>{name}<Check/></span>)}</div><div className="modal-footer"><button onClick={()=>setUploadModalOpen(false)}>Закрити</button><Button onClick={()=>{setUploadModalOpen(false);go("files")}}>Перейти до файлів</Button></div></div></div>}
      {widgetSettingsOpen&&<div className="overlay" onMouseDown={event=>event.target===event.currentTarget&&setWidgetSettingsOpen(false)}><div className="modal widget-modal"><div className="modal-head"><div><span className="modal-icon"><LayoutGrid/></span><div><h2>Налаштувати головну</h2><p>Оберіть блоки для вашого дашборду</p></div></div><button aria-label="Закрити" onClick={()=>setWidgetSettingsOpen(false)}><X/></button></div><div className="widget-list">{["Сьогодні","Зустрічі","Мої задачі","Останні сторінки","Запити на доступ","Корпоративні сервіси"].map((name,index)=><label key={name}><span><strong>{name}</strong><small>{index<3?"Основний віджет":"Додатковий віджет"}</small></span><input type="checkbox" defaultChecked={index!==4}/></label>)}</div><div className="modal-footer"><button onClick={()=>setWidgetSettingsOpen(false)}>Скасувати</button><Button onClick={()=>{setWidgetSettingsOpen(false);showToast("Головну сторінку оновлено")}}>Зберегти</Button></div></div></div>}
      {commentsPanelOpen && <div className="comments-scrim" onMouseDown={e=>e.target===e.currentTarget&&setCommentsPanelOpen(false)}><aside className="comments-drawer"><header><div><span className="eyebrow">UZ WORKSPACE</span><h2>Коментарі</h2></div><button aria-label="Закрити коментарі" onClick={()=>setCommentsPanelOpen(false)}><X/></button></header><div className="drawer-thread">{pageComments.map((comment,i)=><article className={comment.resolved?"resolved":""} key={comment.id}><span className={`avatar mini av${i%4}`}>{comment.initials}</span><div><div><strong>{comment.author}</strong><small>{comment.time}</small></div>{comment.quote&&<blockquote>{comment.quote}</blockquote>}<p>{comment.text}</p><footer><button onClick={()=>setNewComment(`@${comment.author.split(" ")[0]} `)}>Відповісти</button><button onClick={()=>resolveComment(comment.id)}><Check/> {comment.resolved?"Повернути":"Вирішити"}</button></footer></div></article>)}</div><div className="drawer-composer">{selectedQuote&&<div className="composer-quote"><Quote/><span><small>Коментар до фрагмента</small><strong>{selectedQuote.text}</strong></span><button onClick={()=>setSelectedQuote(null)}><X/></button></div>}<div><span className="avatar mini avatar-me">КБ</span><textarea autoFocus value={newComment} onChange={e=>setNewComment(e.target.value)} onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key==="Enter")addComment()}} placeholder="Напишіть коментар або @згадайте колегу…"/></div><footer><small>⌘ ↵ — надіслати</small><Button onClick={addComment}>Надіслати</Button></footer></div></aside></div>}
      {slashOpen && <div className="overlay" onMouseDown={(e)=>e.target===e.currentTarget&&setSlashOpen(false)}><div className="slash-modal"><div className="slash-search"><Search /><input autoFocus placeholder="Знайти блок…"/><button onClick={()=>setSlashOpen(false)}><X /></button></div><p>Основні блоки</p><div className="block-grid">{[
        [FileText,"Текст","Звичайний текстовий блок","text"],
        [Heading1,"Заголовок","Назва секції","heading"],
        [List,"Список","Маркований список","bullets"],
        [ListChecks,"Checklist","Список із виконанням","checklist"],
        [ChevronRight,"Toggle","Згортаний блок","toggle"],
        [Quote,"Цитата","Текст із візуальним акцентом","quote"],
        [Sparkles,"Callout","Акцентована примітка","callout"],
        [Minus,"Розділювач","Горизонтальна лінія","divider"],
        [Table2,"Таблиця","Структуровані дані","table"],
        [KanbanSquare,"Дошка","Kanban із колонками","board"],
        [Image,"Зображення","Завантажити файл","image"],
        [Paperclip,"Файл","PDF, DOCX та інші файли","file"],
        [Link2,"Посилання","Сайт, Drive або Figma","link"],
        [FilePlus2,"Вкладена сторінка","Сторінка всередині сторінки","page"],
      ].map(([BlockIcon,name,desc,kind])=><button key={String(name)} onClick={()=>view==="new-page"?addPageBlock(kind as BlockKind):view==="document"?addDocumentBlock(kind as BlockKind):(setSlashOpen(false),showToast(`Блок «${name}» додано`))}><span>{typeof BlockIcon !== "string" && <BlockIcon />}</span><div><strong>{String(name)}</strong><small>{String(desc)}</small></div></button>)}</div></div></div>}
      {toast && <div className="toast"><Check /> {toast}</div>}
    </div>
  );
}

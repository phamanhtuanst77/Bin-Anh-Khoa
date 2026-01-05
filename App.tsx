
import React, { useState, useRef, useEffect } from 'react';
import { TOPICS } from './constants';
import { Message, Topic } from './types';
import { gemini } from './services/geminiService';
import MarkdownRenderer from './components/MarkdownRenderer';
import { 
  Send, 
  BookOpen, 
  MessageSquare, 
  Menu, 
  X, 
  Loader2, 
  Sparkles, 
  GraduationCap,
  ChevronRight,
  School
} from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Chào mừng em đến với không gian tự học Toán 9! 👋\n\nAnh là **Gia Sư Ảo** của em. Hôm nay em muốn chinh phục thử thách nào? \n\nHãy chọn một **Chuyên đề** ở bên trái hoặc **đặt câu hỏi** trực tiếp cho anh nhé!',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text?: string) => {
    const query = text || input;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    }]);

    try {
      await gemini.sendMessage(query, (chunk) => {
        setMessages(prev => prev.map(msg => 
          msg.id === assistantId ? { ...msg, content: chunk } : msg
        ));
      });
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantId ? { ...msg, content: 'Hệ thống đang bận một chút, em vui lòng thử lại sau nhé! 😅' } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTopic = (topic: Topic) => {
    setCurrentTopic(topic);
    handleSendMessage(`Hãy dạy cho em chuyên đề: ${topic.title}`);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <School className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold font-quicksand leading-tight">TOÁN 9 VÀO 10</h1>
            </div>
            <p className="text-sm text-indigo-100 opacity-90">Hệ thống ôn luyện toàn diện</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              Chuyên đề cốt lõi
            </div>
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group
                  ${currentTopic?.id === topic.id 
                    ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 shadow-sm' 
                    : 'hover:bg-slate-50 text-slate-600'}
                `}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{topic.icon}</span>
                <span className="text-sm font-medium flex-1">{topic.title}</span>
                <ChevronRight className={`w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform ${currentTopic?.id === topic.id ? 'text-indigo-400' : ''}`} />
              </button>
            ))}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <div className="bg-indigo-600 rounded-xl p-4 text-white shadow-lg shadow-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Mục tiêu</span>
              </div>
              <p className="text-sm font-quicksand font-semibold leading-relaxed">
                Đỗ trường chuyên - <br/>Vững trường công! 🚀
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-indigo-600 font-bold font-quicksand">
              <GraduationCap className="w-6 h-6" />
              <span>SIÊU GIA SƯ</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
             <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
             <span className="text-xs font-bold text-amber-700 uppercase">Trạng thái: Đang sẵn sàng</span>
          </div>
        </header>

        {/* Message Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`
                max-w-[85%] md:max-w-[75%] rounded-2xl px-6 py-4 shadow-sm relative
                ${msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}
              `}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-3 text-indigo-500 font-bold text-xs uppercase tracking-tighter">
                    <Sparkles className="w-4 h-4" />
                    GIA SƯ TOÁN 9
                  </div>
                )}
                <MarkdownRenderer content={msg.content} />
                <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1].role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                <span className="text-sm text-slate-500 font-medium">Anh đang suy nghĩ giải pháp tối ưu nhất cho em...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto flex gap-2">
            <div className="flex-1 relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Nhập câu hỏi hoặc đề bài tại đây... (Shift + Enter để xuống dòng)"
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none max-h-32 text-slate-700"
                rows={1}
              />
              <div className="absolute right-3 bottom-2.5 flex items-center gap-2">
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-100 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
            {['Gợi ý lộ trình ôn thi', 'Giải chi tiết câu hình học 10', 'Cách dùng Vi-ét khi x1 x2 không đối xứng'].map((suggest) => (
              <button
                key={suggest}
                onClick={() => handleSendMessage(suggest)}
                className="text-[10px] md:text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
              >
                {suggest}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;

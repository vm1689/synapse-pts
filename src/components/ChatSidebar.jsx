import { Tooltip, Send, PlusIcon, ClockIcon, CollapsePanelRightIcon } from './Icons';
import { accentBg, type } from '../data';

const ChatSidebar = ({ chatCollapsed, setChatCollapsed, chatInput, setChatInput }) => (
  <div
    className={`ferma-chat-sidebar ${chatCollapsed ? 'collapsed' : ''} border-l border-black/10 flex flex-col flex-shrink-0 transition-all duration-300 ${chatCollapsed ? 'w-10' : ''}`}
    style={{ width: chatCollapsed ? undefined : '250px' }}
  >
    {/* Chat Header */}
    <div className={`h-12 mt-3 px-4 flex items-center flex-shrink-0 ${chatCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
      {!chatCollapsed && (
        <span className="h-7 px-3 rounded text-white font-medium flex items-center" style={{ ...accentBg, ...type.small }}>
          Chat
        </span>
      )}
      {!chatCollapsed ? (
        <div className="flex items-center gap-1">
          <Tooltip label="New chat">
            <button className="h-7 w-7 flex items-center justify-center text-black hover:opacity-70">
              <PlusIcon size={16} />
            </button>
          </Tooltip>
          <Tooltip label="Chat history">
            <button className="h-7 w-7 flex items-center justify-center text-black hover:opacity-70">
              <ClockIcon size={16} />
            </button>
          </Tooltip>
          <Tooltip label="Collapse chat">
            <button onClick={() => setChatCollapsed(!chatCollapsed)} className="h-7 w-7 flex items-center justify-center text-black hover:opacity-70">
              <CollapsePanelRightIcon size={16} />
            </button>
          </Tooltip>
        </div>
      ) : (
        <Tooltip label="Expand chat">
          <button onClick={() => setChatCollapsed(!chatCollapsed)} className="h-7 w-7 flex items-center justify-center text-black hover:opacity-70">
            <CollapsePanelRightIcon size={16} />
          </button>
        </Tooltip>
      )}
    </div>

    {/* Chat Messages */}
    {!chatCollapsed && (
      <>
        <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
          {/* Q&A 1 */}
          <div className="flex flex-col items-end">
            <div className="bg-white border border-black/10 text-black rounded-lg px-3 py-2.5" style={type.small}>
              Which trials are at highest risk right now?
            </div>
            <span className="text-black/50 mt-1.5" style={type.caption}>2:34 PM</span>
          </div>

          <div className="flex flex-col">
            <p className="text-black" style={type.small}>
              Three trials are flagged as high risk: <strong>CLARITY-2B</strong> (28% PTS, -12 points), <strong>LIVER-SHIELD</strong> (32% PTS, safety signal), and <strong>PAIN-RELIEF</strong> (38% PTS, placebo response concerns). CLARITY-2B requires the most urgent attention due to enrollment delays and competitive pressure.
            </p>
            <span className="text-black/50 mt-1.5" style={type.caption}>2:35 PM</span>
          </div>

          {/* Q&A 2 */}
          <div className="flex flex-col items-end">
            <div className="bg-white border border-black/10 text-black rounded-lg px-3 py-2.5" style={type.small}>
              What drove the PTS increase for ELEVATE-1?
            </div>
            <span className="text-black/50 mt-1.5" style={type.caption}>2:42 PM</span>
          </div>

          <div className="flex flex-col">
            <p className="text-black" style={type.small}>
              ELEVATE-1 PTS increased from 55% to 62% (+7 points) due to: (1) Positive interim analysis from DMC with trial continuing unchanged, (2) Strong enrollment progress at 82% of target, (3) No concerning safety signals. The competitor Mirati readout in Q2 2026 is the main remaining risk factor.
            </p>
            <span className="text-black/50 mt-1.5" style={type.caption}>2:43 PM</span>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-black/10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about trial PTS..."
              className="flex-1 h-9 px-3 border border-black/20 rounded-md text-black placeholder-black/40 focus:outline-none focus:border-violet-400"
              style={type.small}
            />
            <Tooltip label="Send">
              <button className="h-9 w-9 flex items-center justify-center text-white rounded-md hover:opacity-90" style={accentBg}>
                <Send size={16} />
              </button>
            </Tooltip>
          </div>
        </div>
      </>
    )}
  </div>
);

export default ChatSidebar;

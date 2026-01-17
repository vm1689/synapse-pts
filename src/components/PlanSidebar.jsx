import { Check, Tooltip, CollapsePanelLeftIcon } from './Icons';
import { accentBg, type, planSections } from '../data';

const PlanSidebar = ({
  planCollapsed,
  setPlanCollapsed,
}) => (
  <aside
    className={`ferma-plan-sidebar ${planCollapsed ? 'collapsed' : ''} flex flex-col flex-shrink-0 transition-all duration-300 ${planCollapsed ? 'w-10 pl-2 pr-1' : 'pl-4 pr-3'}`}
    style={{ width: planCollapsed ? undefined : '300px' }}
  >
    {/* Header */}
    <div className={`h-12 mt-3 flex items-center flex-shrink-0 ${planCollapsed ? 'justify-center' : 'justify-between'}`}>
      {!planCollapsed && (
        <span className="h-7 px-3 rounded text-white font-medium flex items-center" style={{ ...accentBg, ...type.small }}>
          Plan
        </span>
      )}
      {!planCollapsed ? (
        <Tooltip label="Collapse">
          <button onClick={() => setPlanCollapsed(!planCollapsed)} className="h-7 w-7 flex items-center justify-center text-white hover:opacity-70">
            <CollapsePanelLeftIcon size={16} />
          </button>
        </Tooltip>
      ) : (
        <Tooltip label="Expand">
          <button onClick={() => setPlanCollapsed(!planCollapsed)} className="h-7 w-7 flex items-center justify-center text-white hover:opacity-70">
            <CollapsePanelLeftIcon size={16} />
          </button>
        </Tooltip>
      )}
    </div>

    {/* Plan Sections */}
    {!planCollapsed && (
      <div className="flex-1 overflow-auto py-3">
        {planSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-3">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/40 uppercase tracking-wider font-medium" style={type.caption}>
                {section.title}
              </span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* Section Steps */}
            {section.steps.map((step, stepIndex) => (
              <div key={stepIndex} className="flex gap-3 ml-1">
                {section.steps.length > 1 && (
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={accentBg}>
                      <Check size={9} className="text-white" strokeWidth={3} />
                    </div>
                    {stepIndex < section.steps.length - 1 && (
                      <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: 'rgba(123, 97, 255, 0.3)' }}></div>
                    )}
                  </div>
                )}
                <div className="pb-3">
                  {step.description ? (
                    <>
                      <h4 className="font-medium text-white mb-0.5" style={type.small}>{step.title}</h4>
                      <p className="text-white/50" style={type.caption}>{step.description}</p>
                    </>
                  ) : (
                    <p className="text-white/80" style={type.small}>{step.title}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )}
  </aside>
);

export default PlanSidebar;

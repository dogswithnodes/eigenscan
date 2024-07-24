import { MouseEvent as SyntheticMouseEvent, useCallback, useEffect, useRef, useState } from 'react';

import { FilterButton, FilterMenu } from './filter-title.styled';

type Props = {
  actionTypes: Array<string>;
  currentActions: Array<string>;
  title: string;
  setCurrentActions: (action: Array<string>) => void;
};

export const FilterTitle: React.FC<Props> = ({ actionTypes, currentActions, title, setCurrentActions }) => {
  const [open, setOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleOutsideClick = ({ target }: MouseEvent) => {
      const trigger = triggerRef.current;
      const menu = menuRef.current;

      if (menu && trigger && open && target instanceof Node) {
        if (target !== menu && target !== trigger && !menu.contains(target) && !trigger.contains(target)) {
          setOpen(false);
        }
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [open]);

  const handleClick = useCallback((e: SyntheticMouseEvent) => {
    e.stopPropagation();

    setOpen((prev) => !prev);
  }, []);

  const [selectedActions, setSelectedActions] = useState<Array<string>>([]);

  return (
    <>
      {title}
      {actionTypes.length > 1 && (
        <>
          <FilterButton ref={triggerRef} $active={currentActions.length > 0} onClick={handleClick}>
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="filter"
              width="1em"
              height="1em"
              fill="#000"
              aria-hidden="true"
            >
              {/* eslint-disable-next-line max-len */}
              <path d="M349 838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V642H349v196zm531.1-684H143.9c-24.5 0-39.8 26.7-27.5 48l221.3 376h348.8l221.3-376c12.1-21.3-3.2-48-27.7-48z"></path>
            </svg>
          </FilterButton>
          {open && (
            <FilterMenu
              ref={menuRef}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ul>
                {actionTypes.map((type) => {
                  const selected = selectedActions.includes(type);

                  return (
                    <li
                      key={type}
                      role="radio"
                      aria-checked={selected}
                      className="filter-menu-item"
                      onClick={() => {
                        setSelectedActions((prev) =>
                          prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
                        );
                      }}
                    >
                      <div className="filter-menu-checkbox">
                        {selected && (
                          <svg
                            width="10"
                            height="7"
                            viewBox="0 0 10 7"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              // eslint-disable-next-line max-len
                              d="M1 3.72727L3.06637 6.12239C3.46527 6.58474 4.18179 6.58474 4.58069 6.12239L9 1"
                              stroke="#000"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span>{type}</span>
                    </li>
                  );
                })}
              </ul>
              <section className="filter-menu-buttons">
                <button
                  onClick={() => {
                    setCurrentActions(actionTypes.length === selectedActions.length ? [] : selectedActions);
                    setOpen(false);
                  }}
                >
                  Ok
                </button>
                <button
                  disabled={selectedActions.length === 0}
                  onClick={() => {
                    setSelectedActions([]);
                  }}
                >
                  Reset
                </button>
              </section>
            </FilterMenu>
          )}
        </>
      )}
    </>
  );
};

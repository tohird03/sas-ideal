import React, {useCallback, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  closestCenter,
  DndContext,
  DragOverlay,
  getFirstCollision,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors} from '@dnd-kit/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext} from '@dnd-kit/sortable';
import update from 'immutability-helper';
import {ClientOnlyPortal} from './ClientOnlyPortal';
import {FieldItem, SectionItem} from './TaskItems';

export const Tasks = observer(({tasks, columns}) => {
  const [data, setData] = useState(null);
  const [items, setItems] = useState({});
  const [containers, setContainers] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const lastOverId = useRef(null);
  const recentlyMovedToNewContainer = useRef(false);
  const isSortingContainer = activeId ? containers.includes(activeId) : false;
  const [oldCol, setOldCol] = useState(null);
  const [finalCol, setFinalCol] = useState(0);

  useEffect(() => {
    if (tasks) {
      setData(tasks);
      const cols = {};

      columns.sort((a, b) => a.order - b.order);
      columns.forEach((c) => {
        cols[`${c.id}`] = [];
      });
      tasks.forEach((d) => {
        if (!(`${d.col_id}` in cols)) {
          cols[`${d.col_id}`] = [];
        }
        cols[`${d.col_id}`].push(`${d.id}`);
      });
      setItems(cols);
      // @ts-ignore
      setContainers(Object.keys(cols));
    }
  }, [tasks, columns]);

  const moveBetweenContainers = useCallback(
    (
      activeContainer,
      overContainer,
      active,
      over, overId
    ) => {
      const activeItems = items[activeContainer];
      const overItems = items[overContainer];
      const overIndex = overItems.indexOf(overId);
      const activeIndex = activeItems.indexOf(active.id);

      setOldCol(activeContainer);
      setFinalCol(overContainer);
      let newIndex;

      if (overId in items) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect?.current?.translated &&
          active.rect?.current?.translated.top >=
            over.rect?.top + over.rect?.height;

        const modifier = isBelowOverItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }
      recentlyMovedToNewContainer.current = true;

      setItems(
        update(items, {
          [activeContainer]: {
            $splice: [[activeIndex, 1]],
          },
          [overContainer]: {
            $splice: [[newIndex, 0, active.id]],
          },
        })
      );
    },
    [items]
  );

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
          ),
        });
      }

      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId !== null) {
        if (overId in items) {
          const containerItems = items[overId];

          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{id: overId}];
      }
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      return lastOverId.current ? [{id: lastOverId.current}] : [];
    },
    [activeId, items]
  );

  const [clonedItems, setClonedItems] = useState(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 5,
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      KeyboardSensor: {
        distance: 5,
        delay: 100,
        tolerance: 5,
      },
    })
  );

  const findContainer = (id) => {
    if (id in items) return id;

    return containers.find((key) => items[key].includes(id));
  };

  function handleDragStart({active}) {
    setActiveId(active.id);
    setClonedItems(items);
  }

  function handleDragOver({active, over}) {
    const overId = over?.id;

    if (!overId || active.id in items) return;

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer || !activeContainer) return;

    if (activeContainer !== overContainer) {
      moveBetweenContainers(
        activeContainer,
        overContainer,
        active,
        over,
        overId
      );
    }
  }

  function handleDragEnd({active, over}) {
    if (!over) {
      setActiveId(null);

      return;
    }

    if (active.id in items && over?.id) {
      setContainers((containers) => {
        const activeIndex = containers.indexOf(active.id);
        const overIndex = containers.indexOf(over.id);

        return arrayMove(containers, activeIndex, overIndex);
      });
    }

    const activeContainer = findContainer(active.id);

    if (!activeContainer) {
      setActiveId(null);

      return;
    }

    const overContainer = findContainer(over.id);

    if (overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id);
      const overIndex = items[overContainer].indexOf(over.id);

      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex,
            overIndex
          ),
        }));
      }
    }

    setActiveId(null);
  }

  const handleDragCancel = () => {
    if (clonedItems) {
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  return (
    <div className="kanban">
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.WhileDragging,
          },
        }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="kanban-container">
          <SortableContext
            items={containers}
            strategy={horizontalListSortingStrategy}
          >
            {containers.map((containerId) => (
              <SectionItem
                id={containerId}
                key={containerId}
                items={items[containerId]}
                name={
                  columns.filter((c) => `${c.id}` === containerId)[0]
                    ?.name
                }
                data={data}
                isSortingContainer={isSortingContainer}
                columns={columns.filter((c) => `${c.id}` === containerId)[0]}
              />
            ))}
          </SortableContext>
        </div>
        <ClientOnlyPortal selector=".kanban">
          <DragOverlay>
            {activeId ? (
              containers.includes(activeId) ? (
                <SectionItem
                  id={activeId}
                  items={items[activeId]}
                  name={
                    columns.filter((c) => `${c.id}` === activeId)[0].name
                  }
                  data={data}
                  dragOverlay
                />
              ) : (
                <FieldItem
                  id={activeId}
                  item={data.filter((d) => `${d.id}` === activeId)[0]}
                  dragOverlay
                />
              )
            ) : null}
          </DragOverlay>
        </ClientOnlyPortal>
      </DndContext>
    </div>
  );
});

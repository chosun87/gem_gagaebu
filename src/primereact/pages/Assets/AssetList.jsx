import { useRef, useEffect, useState, lazy, Suspense, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import Sortable from 'sortablejs';
import {
  Button,
  DataView,
  Message,
  Menu,
  ProgressSpinner,
} from '@/assets/js/PrimeReact';

import AssetListItem from '@/components/common/AssetListItem';

const DialogAsset = lazy(() => import('@/components/DialogAsset'));
const DialogList = lazy(() => import('@/components/DialogList'));

export default function AssetList() {
  const { sheet자산Data, loading } = useData();
  const [asset, setAsset] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDialogAsset, setShowDialogAsset] = useState(false);
  const [showDialogList, setShowDialogList] = useState(false);
  const [dialogListParams, setDialogListParams] = useState({});

  // 자산 데이터 정렬 및 유형 정보 매핑
  const { assetOptions, saveAssetOrder } = useData();

  const sortedAssetData = useMemo(() => {
    return [...sheet자산Data]
      .map((item) => {
        const typeInfo = assetOptions.find((opt) => opt.cd === item.accType);
        return {
          ...item,
          accTypeLabel: typeInfo ? typeInfo.cdLabel : item.accType,
          accTypeIcon: typeInfo ? typeInfo.cdIcon : 'pi pi-tag',
        };
      })
      .sort((a, b) => {
        // accOrder 기준 정렬 (순서가 없으면 이름순)
        const orderA = a.accOrder || 999;
        const orderB = b.accOrder || 999;
        if (orderA !== orderB) return orderA - orderB;
        return (a.accLabel || '').localeCompare(b.accLabel || '');
      });
  }, [sheet자산Data, assetOptions]);

  const listRef = useRef(null);
  const sortableRef = useRef(null);
  const menuLeft = useRef(null);

  useEffect(() => {
    // DataView 렌더링 후 DOM이 안정될 때까지 대기
    const timer = setTimeout(() => {
      if (!listRef.current) return;

      // .list-item들을 직접 감싸고 있는 컨테이너를 타겟팅
      const firstItem = listRef.current.querySelector('.list-item');
      const container = firstItem ? firstItem.parentElement : null;

      if (container && sortedAssetData.length > 0) {
        if (sortableRef.current) {
          sortableRef.current.destroy();
        }

        sortableRef.current = new Sortable(container, {
          animation: 150,
          handle: '.drag-handle',
          ghostClass: 'sortable-ghost',
          onEnd: (evt) => {
            const { oldIndex, newIndex } = evt;
            if (oldIndex === newIndex) return;

            const newOrder = [...sortedAssetData];
            const [movedItem] = newOrder.splice(oldIndex, 1);
            newOrder.splice(newIndex, 0, movedItem);

            saveAssetOrder(newOrder);
          },
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (sortableRef.current) {
        sortableRef.current.destroy();
        sortableRef.current = null;
      }
    };
  }, [sortedAssetData, saveAssetOrder]);

  const menuItems = [
    {
      label: '편집',
      icon: 'pi pi-pencil',
      command: () => fnOpenDialogAsset(selectedItem),
    },
    {
      label: '목록',
      icon: 'pi pi-list',
      command: () => fnOpenDialogList(selectedItem),
    },
  ];

  // Functions -------------------------------------------------------------------------------------
  const fnOpenDialogAsset = (asset) => {
    setAsset(asset);
    setShowDialogAsset(true);
  };

  const fnHideDialogAsset = () => {
    setShowDialogAsset(false);
  };

  const fnOpenDialogList = () => {
    setDialogListParams({
      accCode: selectedItem.accCode,
      header: `${selectedItem.accType}-${selectedItem.accLabel}`,
    });
    setShowDialogList(true);
  };

  const fnHideDialogList = () => {
    setShowDialogList(false);
  };

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const templateDataViewItem = (item) => (
    <AssetListItem
      item={item}
      onClick={(e) => {
        setSelectedItem(item);
        menuLeft.current.toggle(e);
      }}
    />
  );

  return (
    <>
      <div className="panel-content list-page" ref={listRef}>
        {loading ? (
          <div className="full-page">
            <ProgressSpinner />
            <p>데이터를 불러오는 중입니다...</p>
          </div>
        ) : sheet자산Data.length === 0 ? (
          <div className="full-page text-500">
            <Message
              severity="warn"
              text="등록된 자산(계좌) 내역이 없습니다."
            />
          </div>
        ) : (
          <DataView
            className="list-dataview with-btn-floating-action"
            value={sortedAssetData}
            dataKey="accCode"
            itemTemplate={templateDataViewItem}
          />
        )}
      </div>

      <Menu model={menuItems} ref={menuLeft} popup popupAlignment="right" />

      {/* Floating Action Button */}
      <Button
        className="btn-floating-action btn-add-asset shadow-7"
        severity="secondary"
        size="large"
        rounded
        icon="pi pi-plus"
        onClick={() => fnOpenDialogAsset(null)}
        tooltip="자산 추가"
        tooltipOptions={{ position: 'top' }}
      />

      {/* 자산 입력 폼 다이얼로그 */}
      <Suspense fallback={null}>
        {showDialogAsset && (
          <DialogAsset
            asset={asset}
            visible={showDialogAsset}
            onHide={fnHideDialogAsset}
          />
        )}
      </Suspense>

      {/* 연관 내역 조회 다이얼로그 */}
      <Suspense fallback={null}>
        <DialogList
          visible={showDialogList}
          onHide={() => fnHideDialogList()}
          params={dialogListParams}
        />
      </Suspense>
    </>
  );
}

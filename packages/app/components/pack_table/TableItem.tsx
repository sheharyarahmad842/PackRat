import React from 'react';
import { Platform } from 'react-native';

import useCustomStyles from 'app/hooks/useCustomStyles';
import { useState } from 'react';
import { Row } from 'react-native-table-component';
import { DeletePackItemModal } from './DeletePackItemModal';
import { EditPackItemModal } from './EditPackItemModal';
import { formatNumber } from 'app/utils/formatNumber';
import { AddItem } from '../item/AddItem';
import loadStyles from './packtable.style';
import { RText, ZDropdown } from '@packrat/ui';

type ModalName = 'edit' | 'delete';

interface TableItemProps {
  itemData: any;
  checkedItems: string[];
  handleCheckboxChange: (itemId: string) => void;
  index: number;
  hasPermissions: boolean;
  flexArr: number[];
  currentPack: any;
  refetch: () => void;
  setRefetch: () => void;
}

const TableItem = ({
  itemData,
  checkedItems,
  handleCheckboxChange,
  index,
  hasPermissions,
  flexArr,
  currentPack,
  refetch,
  setRefetch = () => {},
}: TableItemProps) => {
  const { name, weight, quantity, unit, id } = itemData;
  const [activeModal, setActiveModal] = useState<ModalName>(null);
  const styles = useCustomStyles(loadStyles);

  const openModal = (modalName: ModalName) => () => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const rowActionItems = [
    { label: 'Edit', onSelect: () => openModal('edit') },
    { label: 'Delete', onSelect: () => openModal('delete') },
    { label: 'Ignore', onSelect: () => {} },
  ];

  let rowData = [
    <RText px={8}>{name}</RText>,
    <RText px={8}>{`${formatNumber(weight)} ${unit}`}</RText>,
    <RText px={8}>{quantity}</RText>,
  ];

  if (hasPermissions) {
    if (
      Platform.OS === 'android' ||
      Platform.OS === 'ios' ||
      window.innerWidth < 900
    ) {
      rowData.push(<ZDropdown.Native dropdownItems={rowActionItems} />);
    } else {
      rowData.push(<ZDropdown.Web dropdownItems={rowActionItems} />);
    }
  }

  /*
  * this id is passed as pack id but it is a item id which is confusing
  Todo need to change the name for this passing argument and remaining functions which are getting it
   */

  // Here, you can set a default category if item.category is null or undefined
  return (
    <>
      <EditPackItemModal
        showTrigger={false}
        isOpen={activeModal === 'edit'}
        onClose={closeModal}
      >
        <AddItem id={id} packId={id} isEdit={true} initialData={itemData} />
      </EditPackItemModal>
      <DeletePackItemModal
        showTrigger={false}
        itemId={id}
        pack={currentPack}
        isOpen={activeModal === 'delete'}
        onClose={closeModal}
      />
      <Row data={rowData} style={styles.row} flexArr={flexArr} />
    </>
  );
};

export default TableItem;

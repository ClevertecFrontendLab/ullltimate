import React, { Dispatch, SetStateAction, useState } from 'react';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { descriptionTariffs } from '@constants/settinds-data';
import { useResize } from '@hooks/use-resize';
import { Tariff } from '@redux/reducers/user-full-slice';
import { TariffList } from '@services/catalogs';
import { useBuyTariffMutation } from '@services/tariff';
import { Button, Drawer, Radio, RadioChangeEvent, Space, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

type SettingDrawerProps = {
    openDrawer: boolean;
    tariff: Tariff | undefined;
    tariffList: TariffList[] | undefined;
    onCloseDrawer: () => void;
    setIsModalResult: Dispatch<SetStateAction<boolean>>;
}
export const SettingDrawer: React.FC<SettingDrawerProps> = ({openDrawer, tariff, tariffList, onCloseDrawer, setIsModalResult}) => {
    const windowSize = useResize();
    const [valueRadio, setValueRadio] = useState<number>();
    const [isDisabledPay, setIsDisabledPay] = useState(true);
    const [buyTariff] = useBuyTariffMutation();
    
    const onChangeRadio = (e: RadioChangeEvent) => {
        setValueRadio(e.target.value);
        setIsDisabledPay(false)
    };
    const payTariff = () => {
        // eslint-disable-next-line no-underscore-dangle
        if(tariffList) buyTariff({tariffId: tariffList[0]._id, days: valueRadio})
                            .unwrap()
                            .then(() => {
                                setIsModalResult(true);
                                onCloseDrawer();
                            })
                            .catch(() => {});
    }

    return (
        <Drawer
        width={windowSize.windowSize < 630 ? 360 : 408}
        style={{marginTop: `${windowSize.windowSize<630 ? '85px': '0px'}`}}
        closeIcon={<CloseOutlined data-test-id='modal-drawer-right-button-close' />}
        title={<span style={{fontSize: 20}}>Сравнить тарифы</span>}
        data-test-id='tariff-sider'
        placement='right'
        onClose={onCloseDrawer}
        open={openDrawer}
        destroyOnClose={true}
        maskStyle={{ background: 'transparent' }}
        headerStyle={{
            padding: `var(--unit-16) var(--unit-${
                windowSize.windowSize < 630 ? 16 : 32
            })`,
            border: 'none',
        }}
        bodyStyle={{
            padding: `0px var(--unit-${windowSize.windowSize < 630 ? 8 : 32})`,
        }}
        footer={
            !tariff &&
            <Button type='primary' data-test-id='tariff-submit' onClick={payTariff} disabled={isDisabledPay} style={{ width: '100%' }}>
                Выбрать и оплатить
            </Button>
        }
        footerStyle={{
            padding: `12px var(--unit-${windowSize.windowSize < 630 ? 16 : 32})`,
        }}
    >
        <div className='description-tariffs'>
            {
                tariff ?
                    <p className='tariff-pro-title'>
                        Ваш PRO tarif активен до {moment(tariff.expired).format('DD.MM')}
                    </p>
                : null
            }
            <Table
                pagination={false}
                style={{paddingTop: `${windowSize.windowSize<370? 'var(--unit-16)':'var(--unit-24)'}`}}
                rowKey={() => uuidv4()}
                dataSource={descriptionTariffs}
            >
                <Column dataIndex='description' key='description' />
                <Column title='FREE' dataIndex='free' key='free' />
                <Column title={<span>PRO {tariff && <CheckCircleOutlined style={{color: 'var(--color-success)'}}/>}</span>} dataIndex='pro' key='pro' />
            </Table>
        </div>
        {
            !tariff &&
                <div className='costs-tariff'>
                    <p className="costs-tariff-title">
                        Стоимость тарифа
                    </p>
                    <Radio.Group onChange={onChangeRadio} value={valueRadio} data-test-id='tariff-cost'>
                        <Space direction='vertical' style={{ width: '100%' }}>
                            {tariffList && 
                                tariffList[0].periods
                                    .map((e) => (
                                        <Radio
                                            key={e.cost}
                                            value={e.days}
                                            className='tariff-radio'
                                            data-test-id={`tariff-${e.cost}`}
                                        >
                                            <span className='tariff-title'>{e.text}</span>
                                            <span className='tariff-cost'>
                                                {String(e.cost).replace('.', ',')} $
                                            </span>
                                        </Radio>
                                    ))}
                        </Space>
                    </Radio.Group>
                </div>
        }
    </Drawer>
    );
};
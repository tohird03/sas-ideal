import React, { forwardRef } from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { IOrder } from '@/api/order/types';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';

Font.register({
  family: 'NotoSans',
  src: '/fonts/noto.ttf',
  fontWeight: 'bold',
});

Font.register({
  family: 'NotoSansBold',
  fontWeight: 'bold',
  src: '/fonts/NotoSans-Bold.ttf',
});

type Props = {
  order: IOrder;
};

export const MyDocument = forwardRef<any, Props>(({ order }, ref) => (
  <Document ref={ref}>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.logo}>SAS-IDEAL</Text>
        <View style={styles.topData}>
          <View>
            <Text style={styles.title}>
              <Text style={styles.titleSpan}>Дата продажа:</Text> {getFullDateFormat(order?.sellingDate)}
            </Text>
            <Text style={styles.title}>
              <Text style={styles.titleSpan}>Харидор:</Text> {order?.client?.name}  -  {order?.client?.phone}
            </Text>
          </View>
        </View>

        {/* Jadval */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.tableHeaderCell, maxWidth: '30px' }}>№</Text>
            <Text style={{ ...styles.tableHeaderCell, maxWidth: '280px', minWidth: '280px' }}>Махсулот номи</Text>
            <Text style={{ ...styles.tableHeaderCell, maxWidth: '35px' }}>✓</Text>
            <Text style={{ ...styles.tableHeaderCell }}>Сони</Text>
            <Text style={{ ...styles.tableHeaderCell }}>Нархи</Text>
            <Text style={{ ...styles.tableHeaderCell }}>Суммаси</Text>
          </View>
          {
            order?.products?.map((product, index) => (
              <View key={product?.id} style={styles.tableRow}>
                <Text style={{ ...styles.tableCell, maxWidth: '30px' }}>{index + 1}</Text>
                <Text style={{ ...styles.tableCell, maxWidth: '280px', minWidth: '280px', textAlign: 'left' }}>{product?.product?.name}</Text>
                <Text style={{ ...styles.tableCell, maxWidth: '35px' }} />
                <Text style={{ ...styles.tableCell }}>{product?.count}</Text>
                <Text style={{ ...styles.tableCell }}>{product?.price}</Text>
                <Text style={{ ...styles.tableCell }}>{priceFormat(product?.count * product?.price)}</Text>
              </View>
            ))
          }
        </View>
        <View style={styles.totalCalc}>
          <Text style={styles.totalCalcText}>Жами сумма: {order?.sum}</Text>
          <Text style={styles.totalCalcText}>Тулов килинди: {order?.payment?.totalPay || 0}</Text>
        </View>
      </View>
    </Page>
  </Document>
));

// PDF uchun stil
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  logo: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '10px',
    fontFamily: 'NotoSansBold',

  },
  topData: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 12,
    fontFamily: 'NotoSans',
    fontWeight: 'bold',
  },
  titleSpan: {
    fontSize: 12,
    fontFamily: 'NotoSansBold',
    fontWeight: 'bold',
  },
  qrImg: {
    width: 70,
  },
  qrTitle: {
    fontSize: 8,
    marginTop: 4,
    fontFamily: 'NotoSans',
    color: '#1b3469',
  },
  content: {
    fontSize: 12,
    marginBottom: 20,
  },
  table: {
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'NotoSansBold',
    fontSize: 8,
    padding: 2,
    borderRightWidth: 1,
    borderColor: 'black',
    fontWeight: 800,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    padding: 2,
    borderRightWidth: 1,
    borderColor: 'black',
    fontSize: 8,
  },
  totalCalc: {
    textAlign: 'right',
  },
  totalCalcText: {
    textAlign: 'right',
    fontSize: 12,
    fontFamily: 'NotoSans',
  },
});

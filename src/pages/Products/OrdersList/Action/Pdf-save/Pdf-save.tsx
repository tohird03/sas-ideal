import React, { forwardRef } from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { IOrder } from '@/api/order/types';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';

// Shriftni ro'yxatdan o'tkazish
Font.register({
  family: 'NotoSans',
  src: '/fonts/noto.ttf',
  fontWeight: 'bold',
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
            <Text style={styles.title}>Дата продажа: {getFullDateFormat(order?.sellingDate)}</Text>
            <Text style={styles.title}>Харидор: {order?.client?.name} {order?.client?.phone}</Text>
          </View>
        </View>

        {/* Jadval */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.tableHeaderCell, maxWidth: '30px' }}>N</Text>
            <Text style={{ ...styles.tableHeaderCell, maxWidth: '250px', minWidth: '250px' }}>Mahsulot nomi</Text>
            <Text style={{ ...styles.tableHeaderCell, maxWidth: '40px' }}>✓</Text>
            <Text style={{ ...styles.tableHeaderCell }}>Soni</Text>
            <Text style={{ ...styles.tableHeaderCell }}>Narxi</Text>
            <Text style={{ ...styles.tableHeaderCell }}>Summasi</Text>
          </View>
          {
            order?.products?.map((product, index) => (
              <View key={product?.id} style={styles.tableRow}>
                <Text style={{ ...styles.tableCell, maxWidth: '30px' }}>{index + 1}</Text>
                <Text style={{ ...styles.tableCell, maxWidth: '250px', minWidth: '250px' }}>{product?.product?.name}</Text>
                <Text style={{ ...styles.tableCell, maxWidth: '40px' }} />
                <Text style={{ ...styles.tableCell }}>{product?.count}</Text>
                <Text style={{ ...styles.tableCell }}>{product?.price}</Text>
                <Text style={{ ...styles.tableCell }}>{priceFormat(product?.count * product?.price)}</Text>
              </View>
            ))
          }
        </View>
        <View style={styles.totalCalc}>
          <Text style={styles.totalCalcText}>Jami narxi: {order?.sum}</Text>
          <Text style={styles.totalCalcText}>Jami to&lsquo;lov: {order?.payment?.totalPay || 0}</Text>
        </View>
      </View>
    </Page>
  </Document>
));

// PDF uchun stil
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  logo: {
    textAlign: 'center',
    fontSize: '18px',
    marginBottom: '10px',
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
    marginTop: 30,
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
    fontFamily: 'NotoSans',
    fontSize: 10,
    padding: 5,
    borderRightWidth: 1,
    borderColor: 'black',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    padding: 5,
    borderRightWidth: 1,
    borderColor: 'black',
    fontSize: 10,
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

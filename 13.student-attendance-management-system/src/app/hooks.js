import { useDispatch, useSelector } from 'react-redux';

/**
 * Standard typed/wrapped Redux hooks
 */
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
